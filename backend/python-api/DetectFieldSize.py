import sklearn
import numpy as np
import matplotlib.pyplot as plt

def remove_outliers(data):
    """
    Remove outliers from the data using the IQR method.
    """
    Q1 = np.percentile(data, 25)
    Q3 = np.percentile(data, 75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR

    return data[(data >= lower_bound) & (data <= upper_bound)]

def detect_field_size(sport_data):
    """
    Detect the field size of a sport field from a given dataset.
    
    Args:
        sport_data: A numpy array containing the sport data.
    """
