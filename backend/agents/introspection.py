from typing import TypedDict, Sequence
from pydantic import BaseModel, Field
from langchain_core.messages import BaseMessage
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph

# Pydantic Model for Structured Output
class IntrospectiveThought(BaseModel):
    """Model for the introspective thought output."""
    introspective_rewrite: str = Field(
        description="The slightly introspective version of the input thought."
    )
    reasoning: str = Field(
        description="Explanation of how the thought was transformed."
    )

# Agent State Definition
class AgentState(TypedDict):
    """State for the introspection agent."""
    input_thought: str
    messages: Sequence[BaseMessage]
    output: IntrospectiveThought | None

# Prompt Creation
def create_introspection_prompt() -> ChatPromptTemplate:
    """
    Creates a prompt that instructs the model to transform thoughts into slightly introspective versions.

    Returns:
        ChatPromptTemplate: The prompt template for the agent.
    """
    return ChatPromptTemplate.from_messages([
        ("system", """You are an expert at subtly transforming thoughts into slightly more introspective versions.
Your task is to take a user’s input thought and rephrase it to add a touch of personal reflection, while keeping it simple and close to the original meaning.

Guidelines:
1. Add a slight personal or reflective twist (e.g., "I wonder", "I’m thinking about").
2. Keep the transformation minimal and natural.
3. Preserve the core intent of the original thought.
4. Provide a brief reasoning for the change.

Examples:
- "What is the time?" → "I wonder what time it is now."
- "Is it going to rain?" → "I’m curious if it’ll rain soon."
- "Tell me a joke." → "I’m thinking about hearing a good joke."

Focus only on this transformation. Do not add extra steps or complexity."""),
        MessagesPlaceholder(variable_name="messages"),
        ("user", "Transform this thought slightly introspectively: {input_thought}")
    ])

# Agent Workflow Creation
def create_introspection_agent() -> StateGraph:
    """
    Sets up the introspection agent with a structured output model.

    Returns:
        StateGraph: The compiled workflow for the agent.
    """
    # Initialize the ChatOpenAI model
    model = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.7,
    )

    # Apply with_structured_output() to enforce structured output
    structured_model = model.with_structured_output(schema=IntrospectiveThought)

    # Create the prompt
    prompt = create_introspection_prompt()

    def transform_thought(state: AgentState) -> AgentState:
        """Transforms the input thought into a slightly introspective version."""
        try:
            # Format the prompt with the input thought
            messages = prompt.format_messages(
                input_thought=state["input_thought"],
                messages=state["messages"]
            )
            # Get the structured output directly from the model
            response = structured_model.invoke(messages)
            state["output"] = response
            return state
        except Exception as e:
            print(f"Error in transform_thought: {str(e)}")
            # Fallback in case of errors
            state["output"] = IntrospectiveThought(
                introspective_rewrite=state["input_thought"],
                reasoning="Error occurred during transformation"
            )
            return state

    # Set up the workflow
    workflow = StateGraph(AgentState)
    workflow.add_node("transform", transform_thought)
    workflow.set_entry_point("transform")
    workflow.set_finish_point("transform")

    return workflow.compile()

# Agent Class
class IntrospectionAgent:
    """Agent for transforming thoughts into slightly introspective versions."""

    def __init__(self):
        self.graph = create_introspection_agent()

    def process_thought(self, thought_text: str) -> IntrospectiveThought:
        """
        Processes a thought and returns its introspective version.

        Args:
            thought_text (str): The original thought to transform.

        Returns:
            IntrospectiveThought: The transformed thought and reasoning.
        """
        if not thought_text:
            return IntrospectiveThought(
                introspective_rewrite="",
                reasoning="No thought provided"
            )

        try:
            initial_state: AgentState = {
                "input_thought": thought_text,
                "messages": [],
                "output": None
            }
            final_state: AgentState = self.graph.invoke(initial_state)
            return final_state["output"]
        except Exception as e:
            print(f"Error in process_thought: {str(e)}")
            return IntrospectiveThought(
                introspective_rewrite=thought_text,
                reasoning="Error occurred during processing"
            )

# Example Usage
if __name__ == "__main__":
    agent = IntrospectionAgent()
    result = agent.process_thought("What is the time?")
    print("Introspective Thought:", result.introspective_rewrite)
    print("Reasoning:", result.reasoning)
