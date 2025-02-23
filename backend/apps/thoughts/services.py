from agents.introspection import IntrospectionAgent
import logging

logger = logging.getLogger(__name__)

class ThoughtIntrospectionService:
    """Service for handling thought introspection"""

    def __init__(self):
        self._agent = IntrospectionAgent()

    def process_thought(self, thought_text: str) -> str:
        """
        Process a thought text and return its introspective version

        Args:
            thought_text: The original thought text

        Returns:
            str: The introspective version of the thought
        """
        try:
            if not thought_text:
                return ""

            result = self._agent.process_thought(thought_text)

            # The agent now always returns an IntrospectiveThought object
            # even in case of errors
            return result.introspective_rewrite

        except Exception as err:
            logger.error(f"Error processing thought: {err}", exc_info=True)
            # In case of any error, return the original text
            return thought_text
