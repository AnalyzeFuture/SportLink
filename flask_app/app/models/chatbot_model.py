import os
from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.runnables import RunnablePassthrough, RunnableParallel

class ChatbotModel:
    def __init__(self):
        # Initialize the LLM
        self.ollama_llm = Ollama(model='llama3.2')

        # Create output parser
        self.parser = StrOutputParser()

        # Load and split document into chunks
        loader = TextLoader('data.txt', encoding='utf-8')
        document = loader.load()
        spliter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=50)
        chunks = spliter.split_documents(document)

        # Initialize the embedding model and vector store
        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vector_storage = FAISS.from_documents(chunks, embedding_model)
        self.retriever = vector_storage.as_retriever()

        # Define the prompt template
        template = """
        You are an AI-powered chatbot designed to provide 
        information and assistance for customers
        based on the context provided to you only. 
                
        Context: {context}
        Question: {question}
        """
        self.prompt = PromptTemplate.from_template(template=template)

        # Create the retrieval and generation pipeline
        result = RunnableParallel(context=self.retriever, question=RunnablePassthrough())
        self.chain = result | self.prompt | self.ollama_llm | self.parser

    def get_response(self, question):
        """Invokes the chatbot model with the given question."""
        return self.chain.invoke(question)
