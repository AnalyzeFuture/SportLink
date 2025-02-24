import os
import requests  # Import requests for making HTTP calls
from datetime import datetime  # Import datetime for checking current year
from langchain_ollama import OllamaLLM  # Updated import
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_huggingface import HuggingFaceEmbeddings  # Updated import
from langchain_community.vectorstores import FAISS
from langchain_core.runnables import RunnablePassthrough, RunnableParallel

class ChatbotModel:
    def __init__(self):
        # Initialize the LLM
        self.ollama_llm = OllamaLLM(model='llama3.2')  # Updated class

        # Create output parser
        self.parser = StrOutputParser()

        # Load and split document into chunks
        loader = TextLoader('data.txt', encoding='utf-8')
        document = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=50)
        chunks = splitter.split_documents(document)

        # Initialize the embedding model and vector store
        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")  # Updated class
        vector_storage = FAISS.from_documents(chunks, embedding_model)
        self.retriever = vector_storage.as_retriever()

        # Define the prompt template with concise and pointwise instructions
        template = """
        You are an AI assistant with expertise in various domains.
        Always keep your responses **short and precise**. 
        If a question requires explanation give brief response for clarity.
                
        Context: {context}
        Question: {userQuery}

        Answer:
        """
        self.prompt = PromptTemplate.from_template(template=template)
        self.conversation_history = []  # Initialize conversation history

    def fetch_from_internet(self, query):
        try:
            # Example using Bing Search API
            api_key = "YOUR_BING_SEARCH_API_KEY"
            search_url = "https://api.bing.microsoft.com/v7.0/search"
            headers = {"Ocp-Apim-Subscription-Key": api_key}
            params = {"q": query, "textDecorations": True, "textFormat": "HTML"}
            response = requests.get(search_url, headers=headers, params=params)
            response.raise_for_status()
            search_results = response.json()
            # Extract relevant information from search results
            snippets = [result["snippet"] for result in search_results["webPages"]["value"]]
            return "\n".join(snippets[:3])  # Return top 3 snippets
        except Exception as e:
            print("Error fetching data from the internet:", str(e))
            return "No relevant context available."

    def get_response(self, userQuery):
        try:
            # Add user query to conversation history
            self.conversation_history.append(f"User: {userQuery}")

            # Retrieve relevant context
            relevant_docs = self.retriever.get_relevant_documents(userQuery)
            context_text = "\n".join([doc.page_content for doc in relevant_docs]) if relevant_docs else self.fetch_from_internet(userQuery)

            # Combine conversation history and context
            combined_context = "\n".join(self.conversation_history[-10:])  # Limit to last 10 exchanges
            combined_context += f"\nContext: {context_text}"

            # Format prompt correctly
            formatted_prompt = self.prompt.format(context=combined_context, userQuery=userQuery)

            # Generate response using correct method
            response = self.ollama_llm(formatted_prompt).strip()

            # Ensure response is concise (limit characters if too long)
            max_length = 500  # Set an appropriate limit
            if len(response) > max_length:
                response = response[:max_length] + "..."  # Trim long responses

            # Add chatbot response to conversation history
            self.conversation_history.append(f"Bot: {response}")

            return response
        except Exception as e:
            print("Error:", str(e))
            return "An error occurred while generating a response."

    def update_data(self):
        # Method to update local data periodically
        try:
            # Fetch new data and update the local document
            new_data = self.fetch_from_internet("latest news and updates")
            with open('data.txt', 'w', encoding='utf-8') as file:
                file.write(new_data)
            # Reload and split the updated document
            loader = TextLoader('data.txt', encoding='utf-8')
            document = loader.load()
            splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=50)
            chunks = splitter.split_documents(document)
            # Update the vector store with new chunks
            vector_storage = FAISS.from_documents(chunks, self.embedding_model)
            self.retriever = vector_storage.as_retriever()
            print("Data updated successfully.")
        except Exception as e:
            print("Error updating data:", str(e))

