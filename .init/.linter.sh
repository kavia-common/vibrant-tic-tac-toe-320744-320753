#!/bin/bash
cd /home/kavia/workspace/code-generation/vibrant-tic-tac-toe-320744-320753/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

