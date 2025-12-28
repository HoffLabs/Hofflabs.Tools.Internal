#!/bin/bash

# IT Multitool Setup Script for Fedora Linux
# This script will help you set up the application for development or production

set -e

echo "==================================="
echo "IT Multitool Setup for Fedora Linux"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing Node.js..."
    sudo dnf install -y nodejs npm
else
    echo "✓ Node.js is already installed ($(node --version))"
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠ Warning: Node.js version 18 or higher is recommended"
    echo "Current version: $(node --version)"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

# Ask user what they want to do
echo ""
echo "What would you like to do?"
echo "1) Start development server"
echo "2) Build for production"
echo "3) Build and start production server"
echo "4) Setup Docker deployment"
echo "5) Exit"
echo ""
read -p "Select option (1-5): " option

case $option in
    1)
        echo ""
        echo "Starting development server..."
        echo "The application will be available at http://localhost:3000"
        npm run dev
        ;;
    2)
        echo ""
        echo "Building for production..."
        npm run build
        echo ""
        echo "✓ Build complete! Run 'npm start' to start the production server."
        ;;
    3)
        echo ""
        echo "Building for production..."
        npm run build
        echo ""
        echo "Starting production server..."
        echo "The application will be available at http://localhost:3000"
        npm start
        ;;
    4)
        if ! command -v docker &> /dev/null; then
            echo ""
            echo "Docker is not installed. Installing Docker..."
            sudo dnf install -y docker
            sudo systemctl start docker
            sudo systemctl enable docker
            sudo usermod -aG docker $USER
            echo ""
            echo "⚠ Docker installed. You may need to log out and back in for group changes to take effect."
        else
            echo "✓ Docker is already installed"
        fi
        
        if ! command -v docker-compose &> /dev/null; then
            echo ""
            echo "Docker Compose is not installed. Installing..."
            sudo dnf install -y docker-compose
        else
            echo "✓ Docker Compose is already installed"
        fi
        
        echo ""
        echo "Building Docker image..."
        docker build -t it-multitool .
        echo ""
        echo "✓ Docker image built successfully!"
        echo ""
        echo "To run with Docker:"
        echo "  docker run -p 3000:3000 it-multitool"
        echo ""
        echo "Or with Docker Compose:"
        echo "  docker-compose up -d"
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac
