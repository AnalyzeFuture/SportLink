import os
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
        spliter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=50)
        chunks = spliter.split_documents(document)

        # Initialize the embedding model and vector store
        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")  # Updated class
        vector_storage = FAISS.from_documents(chunks, embedding_model)
        self.retriever = vector_storage.as_retriever()

        # Define the prompt template
        template = """
        You are an AI assistant with expertise in various domains.
        Whenever possible, answer questions based on the given context.
        If the context does not provide enough information, use your own knowledge to respond. 
                
        Context: {context}
        Question: {userQuery}

        Answer:
        """
        self.prompt = PromptTemplate.from_template(template=template)

        # Create the retrieval and generation pipeline
    #     result = RunnableParallel(context=self.retriever, userQuery=RunnablePassthrough())
    #     self.chain = result | self.prompt | self.ollama_llm | self.parser

    # def get_response(self, userQuery):
    #     """Invokes the chatbot model with the given userQuery."""
    #     return self.chain.invoke(userQuery)

    def get_response(self, userQuery):
        try:
            # Retrieve relevant context
            relevant_docs = self.retriever.get_relevant_documents(userQuery)
            context_text = "\n".join([doc.page_content for doc in relevant_docs]) if relevant_docs else "No relevant context available."

            # Format prompt correctly
            formatted_prompt = self.prompt.format(context=context_text, userQuery=userQuery)

            # Generate response using correct method
            response = self.ollama_llm(formatted_prompt)

            return response
        except Exception as e:
            print("Error:", str(e))
            return "An error occurred while generating a response."