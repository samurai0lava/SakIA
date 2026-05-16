import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from xgboost import XGBClassifier
import joblib

def main():
    print("=" * 60)
    print("       CROP RECOMMENDATION SYSTEM: MODEL TRAINING PIPELINE      ")
    print("=" * 60)

    # 1. Load Dataset
    dataset_path = "Crop_recommendation.csv"
    if not os.path.exists(dataset_path):
        # Fallback to lowercase if needed
        dataset_path = "crop_recommendation.csv"
        
    print(f"[*] Loading dataset from: {dataset_path}")
    try:
        df = pd.read_csv(dataset_path)
    except Exception as e:
        print(f"[!] Error loading dataset: {e}")
        return

    print(f"[+] Loaded {df.shape[0]} samples with {df.shape[1]} columns.")
    print(f"    Features: {list(df.columns[:-1])}")
    print(f"    Target: {df.columns[-1]}")
    
    # 2. Extract Features and Encode Target Labels
    X = df[["N", "P", "K", "ph", "temperature", "rainfall", "humidity"]]
    y_raw = df["label"]
    
    # Use LabelEncoder to convert crop names to integers (0 to 21)
    # This solves the XGBoost string label support issue
    print("[*] Encoding string target crop labels to integers...")
    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(y_raw)
    
    classes = list(label_encoder.classes_)
    print(f"[+] Encoded {len(classes)} unique crop classes successfully.")

    # 3. Train-Test Split (15% test split as requested!)
    print("[*] Splitting dataset into train (85%) and test (15%) sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42, stratify=y
    )
    print(f"    Train set size: {X_train.shape[0]} samples")
    print(f"    Test set size:  {X_test.shape[0]} samples")

    # 4. Initialize Models
    models = {
        "Random Forest": RandomForestClassifier(
            n_estimators=150, 
            random_state=42,
            n_jobs=-1
        ),
        "XGBoost": XGBClassifier(
            n_estimators=150,
            learning_rate=0.05,
            max_depth=6,
            objective="multi:softprob",
            eval_metric="mlogloss",
            random_state=42,
            n_jobs=-1
        )
    }

    # 5. Train and Evaluate Models
    best_accuracy = 0.0
    best_model_name = None
    best_model_obj = None
    results = {}

    print("\n" + "-" * 50)
    print("               MODEL TRAINING & COMPARISON              ")
    print("-" * 50)

    for name, model in models.items():
        print(f"[*] Training {name} Classifier...")
        model.fit(X_train, y_train)
        
        # Predictions
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        results[name] = acc
        print(f"[+] {name} Test Accuracy: {acc:.4f}")
        
        if acc > best_accuracy:
            best_accuracy = acc
            best_model_name = name
            best_model_obj = model

    print("-" * 50)
    print(f"[BEST MODEL] Best Performing Model: {best_model_name} ({best_accuracy:.4f} accuracy)")
    print("-" * 50)

    # 6. Save the Best Model and LabelEncoder together
    model_filename = "best_crop_model.joblib"
    print(f"[*] Saving best model and label encoder to: {model_filename} ...")
    save_data = {
        "model_name": best_model_name,
        "model": best_model_obj,
        "label_encoder": label_encoder,
        "features": list(X.columns)
    }
    joblib.dump(save_data, model_filename)
    print("[+] Model successfully saved!")

    # 7. Evaluate the Saved Model in Detail
    print("\n" + "=" * 60)
    print("                     MODEL EVALUATION                   ")
    print("=" * 60)
    
    # Run predictions with the chosen best model
    y_pred_best = best_model_obj.predict(X_test)
    
    # Text-based Classification Report
    y_test_decoded = label_encoder.inverse_transform(y_test)
    y_pred_decoded = label_encoder.inverse_transform(y_pred_best)
    
    print("\nClassification Report (Test Set):")
    print(classification_report(y_test_decoded, y_pred_decoded))

    # 8. Visual Evaluations: Confusion Matrix Heatmap
    print("[*] Generating confusion matrix plot...")
    plt.figure(figsize=(14, 12))
    
    # Set premium aesthetic styling
    sns.set_theme(style="whitegrid")
    
    cm = confusion_matrix(y_test, y_pred_best)
    sns.heatmap(
        cm, 
        annot=True, 
        fmt="d", 
        cmap="Blues", 
        xticklabels=classes, 
        yticklabels=classes,
        cbar_kws={'label': 'Number of Samples'}
    )
    plt.title(f"Confusion Matrix - {best_model_name} (Accuracy: {best_accuracy:.4f})", fontsize=16, pad=20, weight='bold')
    plt.xlabel("Predicted Crop Class", fontsize=12, labelpad=10)
    plt.ylabel("True Crop Class", fontsize=12, labelpad=10)
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    
    plot_cm_path = "confusion_matrix.png"
    plt.savefig(plot_cm_path, dpi=300)
    plt.close()
    print(f"[+] Confusion matrix heatmap saved as: {plot_cm_path}")

    # 9. Visual Evaluations: Feature Importances
    print("[*] Generating feature importance plot...")
    plt.figure(figsize=(10, 6))
    
    if hasattr(best_model_obj, "feature_importances_"):
        importances = best_model_obj.feature_importances_
        feature_names = ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)", "pH", "Temperature", "Rainfall", "Humidity"]
        
        # Sort importances in descending order
        indices = np.argsort(importances)[::-1]
        
        # Generate elegant color gradient
        colors = sns.color_palette("viridis", len(importances))
        
        sns.barplot(
            x=[feature_names[i] for i in indices], 
            y=importances[indices], 
            palette=colors,
            hue=[feature_names[i] for i in indices],
            legend=False
        )
        
        plt.title(f"Feature Importances for Crop Recommendation ({best_model_name})", fontsize=14, pad=15, weight='bold')
        plt.xlabel("Soil & Weather Features", fontsize=12, labelpad=10)
        plt.ylabel("Relative Importance Value", fontsize=12, labelpad=10)
        plt.ylim(0, max(importances) * 1.1)
        plt.grid(axis='y', linestyle='--', alpha=0.7)
        plt.tight_layout()
        
        plot_fi_path = "feature_importance.png"
        plt.savefig(plot_fi_path, dpi=300)
        plt.close()
        print(f"[+] Feature importance plot saved as: {plot_fi_path}")
    else:
        print("[!] Feature importances are not supported by the winning model.")

    print("\n" + "=" * 60)
    print("              PIPELINE EXECUTED SUCCESSFULLY            ")
    print("=" * 60)

if __name__ == "__main__":
    main()