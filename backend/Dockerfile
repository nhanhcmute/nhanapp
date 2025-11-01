# Use the official .NET 9.0 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Use the .NET runtime image for running
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Install CA certificates for SSL/TLS connections (required for MongoDB Atlas)
RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy the published app from build stage
COPY --from=build /app/out .

# Expose port (Render will set PORT env variable)
ENV ASPNETCORE_URLS=http://+:${PORT:-5000}
EXPOSE 5000

# Run the app
ENTRYPOINT ["dotnet", "backend.dll"]

