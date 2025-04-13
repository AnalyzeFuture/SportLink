import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import numpy as np
import requests

# Global variable to store fetched data
global_data = None

# Function to fetch data from Node
def fetch_data_from_node():
    global global_data
    print("Fetching data from Node server...")
    url = "http://127.0.0.1:5000/api/posts/getallposts"
    response = requests.get(url)
    print(f"Response status code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        # Add likes_count field to each post
        for post in data:
            post['likes_count'] = len(post['likes'])
        global_data = pd.DataFrame(data)
        print("Fetched data from Node:")
        print(global_data.head())
    else:
        # Log message when no data is fetched
        print("No data fetched from the server.")
        global_data = pd.DataFrame()  # Initialize an empty DataFrame

def get_recommendations_from_model(post_id, likes_weight=0.7, content_weight=0.3):
    global global_data
    df = global_data
    # Convert hashtags list to string before concatenating, handle non-list values
    df['combined'] = df['text'] + ' ' + df['hashtags'].apply(lambda x: ' '.join(x) if isinstance(x, list) else '')


    print(df.head())
    # TF-IDF Vectorizer
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined'])

    # Compute the cosine similarity matrix
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    # Normalize the likes to a scale of 0 to 1
    df['normalized_likes'] = df['likes_count'] / df['likes_count'].max()

    idx = df.index[df['_id'] == post_id].tolist()[0]
    
    # Get similarity scores and likes
    sim_scores = list(enumerate(cosine_sim[idx]))
    like_scores = df['normalized_likes'].values
    
    # Combine scores
    combined_scores = []
    for i, sim in sim_scores:
        combined_score = (likes_weight * like_scores[i]) + (content_weight * sim)
        combined_scores.append((i, combined_score))
    
    # Sort by combined score
    combined_scores = sorted(combined_scores, key=lambda x: x[1], reverse=True)
    
    # Exclude the queried post itself
    combined_scores = combined_scores[1:4]  # Top 3 recommendations
    
    # Get post indices
    post_indices = [i[0] for i in combined_scores]
    return df['_id'].iloc[post_indices].tolist()
