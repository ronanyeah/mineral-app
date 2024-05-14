# Use the latest Ubuntu base image
FROM ubuntu:latest

# Update the package lists and install wget and unzip
# Clean up the package lists to reduce image size
RUN apt-get update && \\
    apt-get install -y wget unzip && \\
    apt-get clean

# Download the mineral-app release archive
# Unzip the archive
# Remove the archive after unzipping
RUN wget https://github.com/ronanyeah/mineral-app/releases/download/v1/linux.zip && \\
    unzip linux.zip && \\
    rm linux.zip

# Make the mineral-linux binary executable
RUN chmod +x mineral-linux

# Set the WALLET environment variable
ENV WALLET=put_your_sui_private_key_here


# Set the default command to run the mineral-linux binary with the "mine" argument
CMD ["./mineral-linux", "mine"]
