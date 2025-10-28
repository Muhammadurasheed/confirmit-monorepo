"""
Multi-Agent Orchestrator for Receipt Analysis
Coordinates vision, forensic, metadata, reputation, and reasoning agents
"""
import asyncio
import logging
from typing import Dict, List, Any
from datetime import datetime

logger = logging.getLogger(__name__)


class ReceiptAnalysisOrchestrator:
    """Orchestrates multiple AI agents for comprehensive receipt analysis"""

    def __init__(
        self,
        vision_agent,
        forensic_agent,
        metadata_agent,
        reputation_agent,
        reasoning_agent,
    ):
        self.vision_agent = vision_agent
        self.forensic_agent = forensic_agent
        self.metadata_agent = metadata_agent
        self.reputation_agent = reputation_agent
        self.reasoning_agent = reasoning_agent

    async def analyze_receipt(
        self, image_path: str, receipt_id: str
    ) -> Dict[str, Any]:
        """
        Run all agents in parallel and synthesize results

        Returns comprehensive analysis including trust score, verdict, issues, etc.
        """
        start_time = datetime.now()
        agent_results = {}
        agent_logs = []

        try:
            # Run agents in parallel with timeouts
            logger.info(f"Starting multi-agent analysis for receipt {receipt_id}")

            # Execute all agents concurrently
            results = await asyncio.gather(
                self._run_vision_agent(image_path, receipt_id),
                self._run_forensic_agent(image_path, receipt_id),
                self._run_metadata_agent(image_path, receipt_id),
                return_exceptions=True,
            )

            # Process results
            vision_result, forensic_result, metadata_result = results

            if not isinstance(vision_result, Exception):
                agent_results["vision"] = vision_result
                agent_logs.append(
                    {
                        "agent": "vision",
                        "status": "success",
                        "confidence": vision_result.get("confidence", 0),
                    }
                )

            if not isinstance(forensic_result, Exception):
                agent_results["forensic"] = forensic_result
                agent_logs.append(
                    {
                        "agent": "forensic",
                        "status": "success",
                        "manipulation_score": forensic_result.get(
                            "manipulation_score", 0
                        ),
                    }
                )

            if not isinstance(metadata_result, Exception):
                agent_results["metadata"] = metadata_result
                agent_logs.append(
                    {
                        "agent": "metadata",
                        "status": "success",
                        "flags": len(metadata_result.get("flags", [])),
                    }
                )

            # Run reputation agent if we have extracted text
            if "vision" in agent_results:
                ocr_text = agent_results["vision"].get("ocr_text", "")
                reputation_result = await self._run_reputation_agent(
                    ocr_text, receipt_id
                )
                if not isinstance(reputation_result, Exception):
                    agent_results["reputation"] = reputation_result
                    agent_logs.append(
                        {
                            "agent": "reputation",
                            "status": "success",
                            "accounts_checked": len(
                                reputation_result.get("accounts_analyzed", [])
                            ),
                        }
                    )

            # Run reasoning agent to synthesize all results
            final_analysis = await self._run_reasoning_agent(agent_results, receipt_id)

            # Calculate processing time
            processing_time = (datetime.now() - start_time).total_seconds()

            # Compile final response
            return {
                "receipt_id": receipt_id,
                "trust_score": final_analysis.get("trust_score", 50),
                "verdict": final_analysis.get("verdict", "unclear"),
                "issues": final_analysis.get("issues", []),
                "recommendation": final_analysis.get("recommendation", ""),
                "forensic_details": {
                    "ocr_confidence": agent_results.get("vision", {}).get(
                        "confidence", 0
                    ),
                    "manipulation_score": agent_results.get("forensic", {}).get(
                        "manipulation_score", 0
                    ),
                    "metadata_flags": agent_results.get("metadata", {}).get(
                        "flags", []
                    ),
                },
                "merchant": agent_results.get("reputation", {}).get("merchant"),
                "agent_logs": agent_logs,
                "processing_time_seconds": processing_time,
            }

        except Exception as e:
            logger.error(f"Orchestrator error for receipt {receipt_id}: {str(e)}")
            return {
                "receipt_id": receipt_id,
                "trust_score": 0,
                "verdict": "unclear",
                "issues": [
                    {
                        "type": "analysis_error",
                        "severity": "high",
                        "description": f"Analysis failed: {str(e)}",
                    }
                ],
                "recommendation": "Unable to verify receipt. Please try again.",
                "forensic_details": {
                    "ocr_confidence": 0,
                    "manipulation_score": 0,
                    "metadata_flags": [],
                },
                "merchant": None,
                "agent_logs": agent_logs,
            }

    async def _run_vision_agent(self, image_path: str, receipt_id: str) -> Dict:
        """Run Gemini Vision agent for OCR and visual analysis"""
        try:
            logger.info(f"Running vision agent for {receipt_id}")
            result = await self.vision_agent.analyze(image_path)
            logger.info(f"Vision agent completed for {receipt_id}")
            return result
        except Exception as e:
            logger.error(f"Vision agent failed for {receipt_id}: {str(e)}")
            raise

    async def _run_forensic_agent(self, image_path: str, receipt_id: str) -> Dict:
        """Run forensic analysis agent"""
        try:
            logger.info(f"Running forensic agent for {receipt_id}")
            result = await self.forensic_agent.analyze(image_path)
            logger.info(f"Forensic agent completed for {receipt_id}")
            return result
        except Exception as e:
            logger.error(f"Forensic agent failed for {receipt_id}: {str(e)}")
            raise

    async def _run_metadata_agent(self, image_path: str, receipt_id: str) -> Dict:
        """Run metadata extraction agent"""
        try:
            logger.info(f"Running metadata agent for {receipt_id}")
            result = await self.metadata_agent.analyze(image_path)
            logger.info(f"Metadata agent completed for {receipt_id}")
            return result
        except Exception as e:
            logger.error(f"Metadata agent failed for {receipt_id}: {str(e)}")
            raise

    async def _run_reputation_agent(self, ocr_text: str, receipt_id: str) -> Dict:
        """Run reputation checking agent"""
        try:
            logger.info(f"Running reputation agent for {receipt_id}")
            result = await self.reputation_agent.analyze(ocr_text)
            logger.info(f"Reputation agent completed for {receipt_id}")
            return result
        except Exception as e:
            logger.error(f"Reputation agent failed for {receipt_id}: {str(e)}")
            raise

    async def _run_reasoning_agent(
        self, agent_results: Dict, receipt_id: str
    ) -> Dict:
        """Run reasoning agent to synthesize all results"""
        try:
            logger.info(f"Running reasoning agent for {receipt_id}")
            result = await self.reasoning_agent.synthesize(agent_results)
            logger.info(f"Reasoning agent completed for {receipt_id}")
            return result
        except Exception as e:
            logger.error(f"Reasoning agent failed for {receipt_id}: {str(e)}")
            # Return default safe result
            return {
                "trust_score": 50,
                "verdict": "unclear",
                "issues": [],
                "recommendation": "Unable to complete analysis",
            }
