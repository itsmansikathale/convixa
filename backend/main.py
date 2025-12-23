# ===============================================================================
# STEP 1: BASIC SETUP & iMPORTS
# ===============================================================================
import asyncio     # For async/await (like is JS)
import os      #to read environment variables
import logging    # Better than printf() for debugging
from uuid import uuid4  # Generate unique IDs
from dotenv import load_dotenv    # Load .env files

#  Import libraries from Vision Agents - Core library
from vision_agents.core import agents    #Main Agent class
from vision_agents.plugins import getstream, gemini    #Stream & Gemini Integrations
from vision_agents.core.edge.types import User    # User type of agent

from vision_agents.core.events import(
    CallSessionParticipantJoinedEvent,
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent,
    CallSessionEndedEvent,
    PluginErrorEvent,
)

# imports for Gemini
# from vision_agents.core.llm.events import(
#     RealtimeUserTranscriptionEvent,     #When speech is transcribed
#     LLMResponseChunkEvent     #When agent responds
# )

        
# ===============================================================================
#  STEP 2: ADD EVENT HANDLERS - Session & Participants
# ===============================================================================



# setting up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()      # now lets load all of our environment variables from .env file


meeting_data ={        #taking a variable
    "transcript": [],      # to store transcript data
    "is_active": False   # to track if meeting is active
}     

async def start_agent(call_id:str):       # Now lets actually create an agent function 
    logger.info("🤖 Starting Meeting Assistant....")
    logger.info(f"📞 Call ID: {call_id}")

    agent = agents.Agent(      #creating an agent instance
        edge = getstream.Edge(),
        agent_user=User(
            id="meeting-assistant-bot",
            name="Meeting Assitant",

        ),
        instructions="""
        You are a meeting transcription bot.

        CRITICAL RULES - FOLLOW EXACTLY:
        1. YOU MUST NEVER SPEAK unless someone says "Hey Assistant"
        2. DO NOT respond to conversations between users
        3. DO NOT acknowledge anything users say to each other
        4. DO NOT explain that you're staying silent
        5. DO NOT say "I should remain silent" or any variation
        6. ONLY RESPOND when you expliciitly hear "Hey Assistant" 
        followed by a question
        7. If unsure whether to speak: DON'T SPEAK

        Your ONLY job: 
        - Listen silently
        - Transcribe everything
        - Wait for "Hey Assistant"

        When you DO hear "Hey Assistant":
        - Answer the question using meeting transcript and notes
        - Keep answer short and factual
        - Use only information from this meeting
        
        Example:
        ❌ User: "Let's discuss the budget" -> You: STAY COMPLETELY SILENT
        ❌ User: "What do you think? -> You: STAY COMPLETELY SILENT

        ✅ User: "Hey Assistant, what are the actions items?" -> You: Answer with action items
        ✅ User: "Hey Assistant, summarize the meeting" -> You: Provide summary
        """

        Your ONLY job: 



        
        """,

        llm=gemini.Realtime(fps=0),    #use Gemini Realtime API(handles STT,LLM,TTS)  2. fps=0 means no video frames sent(audio only , saves cost)
    )

    # Store agent reference for later use
    meeting_data["agent"] = agent
    meeting_data["call_id"] = call_id
    await agent.create_user()

    call = agent.edge.client.video.call("default", call_id)
    logger.info("✅ Joining call ....")
    await agent.join(call)

    logger.info("✔️ Agent joined the call sucessfully")
    meeting_data["is_active"] = True
    @agent.events.subscribe
    async def handle_call_end(event):
         if not isinstance(event, CallSessionEndedEvent):
             return
             logger.info(" 📞 Call Ended")
             meeting_data["is_active"] = False

            # wait until the call ends
             while meeting_data["is_active"]:
                await asyncio.sleep(1)  # Keep the agent running

    await agent.finish()
    logger.info("🤖 Agent finished processing")            
# ===============================================================================
# STEP 3 : ADD TRANSCRIPTION HANDLER
# ===============================================================================



    # @agent.events.subscribe
    # async def handle_session_started(event):
    #     if not isinstance(event, CallSessionStartedEvent):
    #         return
    #     logger.info("📞 Call Started")
    #     meeting_data["is_active"] = True

    #     logger.info("🤖 Meeting Assistant is now active!")
    #     # await agent.create_user()
    #     # call = agent.edge.client.video.call("default", call_id)
    #     logger.info("✔️ Joining call.... ")
    #     async with agent.join(call):
    #         while meeting_data["is_active"]:
    #             await asyncio.sleep(1) # Keep the agent running
    #         logger.info(" 📞 Joined call Successfully")
    #         logger.info("\n📝 Features:")
    #         logger.info("    1. ✅ Auto - transcription")
    #         logger.info("    2. ✔️ Q & A(say 'Hey Assistant' + question)")
    #         await agent.finish()
    #         logger.info("Agent finished processing.")

# ===============================================================================
# STEP 4 : ADD Q & A FEATURE , so that users can ask questions
# ===============================================================================





# ===============================================================================
# STEP 5 Add Error Handling & Cleanup
# ===============================================================================






# ===============================================================================
# Entry Point
# ===============================================================================
def print_meeting_summary():
    """
    Print the meeting summary 
    """
    logger.info("📝 Meeting Summary:")
    full_transcript = " ".join(meeting_data["transcript"])
    logger.info(full_transcript)

if __name__ == "__main__":       #this is our main entry point
    call_id = os.getenv("CALL_ID", f"meeting-{uuid4().hex[:8]}")
    # for testing
    
    try:
        asyncio.run(start_agent(call_id))

    except KeyboardInterrupt:
            print("\n\n Server stopped by user")

    finally:
        if meeting_data["transcript"]:
            print_meeting_summary()

