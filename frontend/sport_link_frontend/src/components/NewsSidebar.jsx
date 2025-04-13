import { Box, Text, VStack, Link, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const NewsSidebar = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://newsapi.org/v2/top-headlines?category=sports&country=in&apiKey=d9d725eaf5154249b28cd86fa699ec66"
        );
        const data = await res.json();
        console.log(data);
        // setNews(data.articles.slice(0, 5)); // Show only top 5 news articles
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <Box
      bg="gray.900"
      p={4}
      borderRadius="lg"
      boxShadow="md"
      w="250px"
      position="fixed"
      right="40px"
      top="80px"
      color="white"
    >
      <Text fontSize="lg" fontWeight="bold" mb={3}>
        Latest Sports News 🏆
      </Text>

      {loading && <Spinner size="md" color="white" />}

      <VStack align="start" spacing={3}>
        {news.map((article, index) => (
          <Link
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            color="blue.400"
            _hover={{ textDecoration: "underline" }}
          >
            {article.title}
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default NewsSidebar;
