#!/bin/bash
echo "Cleaning Note Management Project for Submission..."

# Backend cleanup
rm -rf backend/node_modules backend/dist backend/*.log backend/.DS_Store backend/dev-dist

# Frontend cleanup 
rm -rf frontend/node_modules frontend/dist frontend/dev-dist frontend/*.log frontend/.DS_Store

# Root cleanup
rm -rf *.log .DS_Store .env

echo "Clean up successful! Project is ready for compression."

