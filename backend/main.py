# ==========================================================
# STEP 1 : BASIC SETUP & iMPORTS
# =========================================================

import asyncio #For async / await (Like is JavaScript)
import os #to read environment variables
import logging #better than print() for debugging
from uuid import uuid4 #Generate unique IDs
from dotenv import load_dotenv # Load .env file

# import components from vision agents library(vision-agents[getstream, gemini])
# Vision Agents - Core Library 
from vision_agents.core import agents   #Main Agent Class
from vision_agents.plugins import getstream, gemini  #Stream & Gemini integrations
from vision_agents.core.edge.types import User   #User type for agent

from vision_agents.core.events import {
    CallSessionParticiapantJoinedEvent,
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent,
    CallSessionEndedEvent,
    PluginErrorEvent
}

# From Gemini Side Imports
from vision_agents.core.llm.events import {
    RealtimeUserTranscriptionEvent,    #when speech is transcribed
    # so that we can transcribe this and this will  provide the segment of what users is talking about 
    # & then we can provide it to the gemini to  process this


    LLMResponseChunkEvent    #When agents responds we can send it to frontend


}





# ==========================================================
# STEP 2: Add Event Listeners - Session & Participants
# =========================================================
 







# ==========================================================
# STEP 3 : Add Transription Handlers
# =========================================================








# ==========================================================
# STEP 4 : Add Q&A Features using Agents
# =========================================================











# ==========================================================
# STEP 5 : Add Error Handling and Cleanup
# =========================================================
 