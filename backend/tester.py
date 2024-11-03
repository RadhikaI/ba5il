import cv2
import mediapipe as mp
import numpy as np
from time import time

class GazeTracker:
    def __init__(self):
        # Initialize MediaPipe Face Mesh
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Eye landmark indices
        self.LEFT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
        self.RIGHT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
        self.LEFT_IRIS = [474, 475, 476, 477]
        self.RIGHT_IRIS = [469, 470, 471, 472]
        
        # Define the 9 points grid
        self.grid_points = {
            'top_left': {'x': -1, 'y': -1},
            'top_middle': {'x': 0, 'y': -1},
            'top_right': {'x': 1, 'y': -1},
            'middle_left': {'x': -1, 'y': 0},
            'center': {'x': 0, 'y': 0},
            'middle_right': {'x': 1, 'y': 0},
            'bottom_left': {'x': -1, 'y': 1},
            'bottom_middle': {'x': 0, 'y': 1},
            'bottom_right': {'x': 1, 'y': 1}
        }
        
        # Sequence tracking
        self.current_sequence = []
        self.last_point_time = 0
        self.dwell_time = 1.0  # Time needed to focus on a point
        self.point_cooldown = 1.0  # Time before the same point can be selected again
        
        # Initialize tracking variables
        self.frame = None
        self.eye_left_center = None
        self.eye_right_center = None
        self.iris_left_center = None
        self.iris_right_center = None
        
        # Detection parameters
        self.point_radius_threshold = 0.7  # Increased for easier detection
        self.smoothing_factor = 0.3
        self.last_gaze_point = {'x': 0, 'y': 0}
        
        # Amplification factors
        self.x_amplification = 2.0  # Horizontal movement amplification
        self.y_amplification = 7.0  # Vertical movement amplification (increased more)

    def analyze(self, frame):
        """Analyze a frame to detect gaze direction"""
        self.frame = frame
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(frame_rgb)
        
        if not results.multi_face_landmarks:
            return False
            
        mesh_points = np.array([
            np.multiply([p.x, p.y], [frame.shape[1], frame.shape[0]]).astype(int)
            for p in results.multi_face_landmarks[0].landmark
        ])
        
        # Get eye and iris points
        left_eye_points = mesh_points[self.LEFT_EYE]
        right_eye_points = mesh_points[self.RIGHT_EYE]
        left_iris_points = mesh_points[self.LEFT_IRIS]
        right_iris_points = mesh_points[self.RIGHT_IRIS]
        
        # Calculate centers
        self.eye_left_center = np.mean(left_eye_points, axis=0).astype(int)
        self.eye_right_center = np.mean(right_eye_points, axis=0).astype(int)
        self.iris_left_center = np.mean(left_iris_points, axis=0).astype(int)
        self.iris_right_center = np.mean(right_iris_points, axis=0).astype(int)
        
        return True

    def get_normalized_gaze_coordinates(self):
        """Get normalized gaze coordinates between -1 and 1 for both x and y"""
        if self.iris_left_center is None or self.iris_right_center is None:
            return None
            
        # Calculate relative positions and normalize
        left_rel_x = (self.iris_left_center[0] - self.eye_left_center[0]) / 10
        right_rel_x = (self.iris_right_center[0] - self.eye_right_center[0]) / 10
        left_rel_y = -(self.iris_left_center[1] - self.eye_left_center[1]) / 5
        right_rel_y = -(self.iris_right_center[1] - self.eye_right_center[1]) / 5
        
        # Average the coordinates
        x_coord = (left_rel_x + right_rel_x) / 2
        y_coord = (left_rel_y + right_rel_y) / 2
        
        y_coord -= 0.4/3
        # Apply amplification
        x_coord *= self.x_amplification
        y_coord *= self.y_amplification
        
        # Apply smoothing
        x_coord = (x_coord * self.smoothing_factor + 
                  self.last_gaze_point['x'] * (1 - self.smoothing_factor))
        y_coord = (y_coord * self.smoothing_factor + 
                  self.last_gaze_point['y'] * (1 - self.smoothing_factor))
        
        # Update last gaze point
        self.last_gaze_point = {'x': x_coord, 'y': y_coord}
        
        # Clamp values between -1 and 1
        x_coord = np.clip(x_coord, -1, 1)
        y_coord = np.clip(y_coord, -1, 1)
        
        return {'x': x_coord, 'y': y_coord}

    def get_focused_point(self):
        """Determine which of the 9 points the user is looking at"""
        coords = self.get_normalized_gaze_coordinates()
        print(coords)
        if coords is None:
            return None
            
        closest_point = None
        min_distance = float('inf')
        
        # Find the closest grid point to the current gaze position
        for point_name, point_coords in self.grid_points.items():
            distance = np.sqrt(
                (coords['x'] - point_coords['x'])**2 + 
                (coords['y'] - point_coords['y'])**2
            )
            
            if distance < min_distance:
                min_distance = distance
                closest_point = point_name
        
        # Only return the point if it's within the threshold radius
        if min_distance <= self.point_radius_threshold:
            return closest_point
        return None

    def update_sequence(self):
        """Update the sequence of connected points"""
        current_time = time()
        focused_point = self.get_focused_point()
        
        if focused_point is None:
            return False
            
        # Check if we've been looking at this point long enough
        if (focused_point not in self.current_sequence or 
            (focused_point == self.current_sequence[-1] and 
             current_time - self.last_point_time >= self.point_cooldown)):
            
            if current_time - self.last_point_time >= self.dwell_time:
                if focused_point not in self.current_sequence:
                    self.current_sequence.append(focused_point)
                    self.last_point_time = current_time
                    print(f"Sequence: {self.current_sequence}")
                    
                    # Check if we have 4 distinct points
                    if len(self.current_sequence) >= 4:
                        return True
        
        return False

    def draw_debug(self):
        """Draw debug visualization on the frame"""
        if self.frame is None:
            return self.frame
            
        frame = self.frame.copy()
        height, width = frame.shape[:2]
        
        # Draw grid points and their connections
        points_pixel_coords = {}
        
        # First, calculate all pixel coordinates
        for point_name, point_coords in self.grid_points.items():
            x = int((point_coords['x'] + 1) * width / 2)
            y = int((point_coords['y'] + 1) * height / 2)
            points_pixel_coords[point_name] = (x, y)
            
            # Draw point (larger if in sequence)
            radius = 15 if point_name in self.current_sequence else 10
            color = (0, 255, 0) if point_name in self.current_sequence else (0, 0, 255)
            cv2.circle(frame, (x, y), radius, color, -1)
            
            # Add label
            cv2.putText(frame, point_name, (x-30, y-20),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Draw connections between points in sequence
        for i in range(len(self.current_sequence) - 1):
            start_point = points_pixel_coords[self.current_sequence[i]]
            end_point = points_pixel_coords[self.current_sequence[i + 1]]
            cv2.line(frame, start_point, end_point, (0, 255, 0), 2)
        
        # Draw current gaze position
        coords = self.get_normalized_gaze_coordinates()
        if coords:
            gaze_x = int((coords['x'] + 1) * width / 2)
            gaze_y = int((coords['y'] + 1) * height / 2)
            cv2.circle(frame, (gaze_x, gaze_y), 15, (255, 255, 0), 2)
        
        # Draw sequence progress
        cv2.putText(frame, f"Points: {len(self.current_sequence)}/4", (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        return frame

def main():
    cap = cv2.VideoCapture(0)
    tracker = GazeTracker()
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        # Analyze frame
        if tracker.analyze(frame):
            # Update sequence and check for completion
            if tracker.update_sequence():
                print("Pattern complete! Exiting...")
                break
            
    
    cap.release()

if __name__ == "__main__":
    main()
