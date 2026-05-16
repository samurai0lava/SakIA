import os
import sys
import joblib
import pandas as pd
import numpy as np

def predict(n, p, k, ph, temp, rainfall, humidity):
    model_path = "best_crop_model.joblib"
    if not os.path.exists(model_path):
        print(f"[!] Error: Model file '{model_path}' not found.")
        print("[!] Please run 'python api.py' first to train and save the model.")
        return

    # Load saved model data package
    try:
        data = joblib.load(model_path)
    except Exception as e:
        print(f"[!] Error loading model: {e}")
        return

    model = data["model"]
    label_encoder = data["label_encoder"]
    features = data["features"]
    model_name = data["model_name"]

    # Build input DataFrame matching exact feature names and order
    input_data = pd.DataFrame([{
        "N": n,
        "P": p,
        "K": k,
        "ph": ph,
        "temperature": temp,
        "rainfall": rainfall,
        "humidity": humidity
    }])
    
    # Reorder columns to match train features exactly
    input_data = input_data[features]

    # Predict crop class index
    pred_idx = model.predict(input_data)[0]
    predicted_crop = label_encoder.inverse_transform([pred_idx])[0]

    print("\n" + "=" * 55)
    print(f"  CROP PREDICTION RESULTS (Model: {model_name})")
    print("=" * 55)
    print(f"Inputs:")
    print(f"  - Nitrogen (N):   {n:>5} kg/ha")
    print(f"  - Phosphorus (P): {p:>5} kg/ha")
    print(f"  - Potassium (K):  {k:>5} kg/ha")
    print(f"  - soil pH value:  {ph:>5.2f}")
    print(f"  - Temperature:    {temp:>5.2f} °C")
    print(f"  - Humidity:       {humidity:>5.2f} %")
    print(f"  - Rainfall:       {rainfall:>5.2f} mm")
    print("-" * 55)

    # Get class probabilities if supported (both RF and XGBoost support this)
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(input_data)[0]
        top_indices = np.argsort(probs)[::-1][:3]
        top_crops = label_encoder.inverse_transform(top_indices)
        top_probs = probs[top_indices]
        
        print(f"[Rank 1] Primary Crop Recommended: {predicted_crop.upper()} ({top_probs[0] * 100:.2f}% confidence)")
        print("\nTop 3 Crop Recommendations:")
        for idx, (crop, prob) in enumerate(zip(top_crops, top_probs), 1):
            rank_label = "[1st]" if idx == 1 else "[2nd]" if idx == 2 else "[3rd]"
            print(f"  {rank_label} {crop.capitalize():<15} : {prob * 100:.2f}% confidence")
    else:
        print(f"[Rank 1] Recommended Crop: {predicted_crop.upper()}")
    print("=" * 55 + "\n")

if __name__ == "__main__":
    # Check if command line arguments are provided
    # Format: python predict.py N P K pH Temperature Rainfall Humidity
    if len(sys.argv) == 8:
        try:
            n = float(sys.argv[1])
            p = float(sys.argv[2])
            k = float(sys.argv[3])
            ph = float(sys.argv[4])
            temp = float(sys.argv[5])
            rainfall = float(sys.argv[6])
            humidity = float(sys.argv[7])
            predict(n, p, k, ph, temp, rainfall, humidity)
        except ValueError:
            print("[!] Error: Arguments must be numerical.")
            print("Usage: python predict.py <N> <P> <K> <pH> <temperature> <rainfall> <humidity>")
    else:
        # Demo sample prediction (Rice values from row 1 of the dataset)
        # N=90, P=42, K=43, ph=6.5, temp=20.87, rainfall=202.93, humidity=82.0
        print("[*] Running demonstration prediction with sample soil/weather readings...")
        predict(
            n=90, 
            p=42, 
            k=43, 
            ph=6.5, 
            temp=20.87, 
            rainfall=202.93, 
            humidity=82.0
        )
        print("[i] You can also run custom predictions from the terminal:")
        print("    Usage: python predict.py <N> <P> <K> <pH> <temperature> <rainfall> <humidity>")
        print("    Example: python predict.py 85 58 41 7.0 21.8 226.7 80.3")
