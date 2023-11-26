FROM node:20-alpine as build_frontend
ARG API_URL
WORKDIR /app
COPY ./frontend/ .
RUN echo VITE_API_URL=$API_URL > .env
RUN npm i
RUN npm run build

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 4000

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["backend/KotnurVersus.Web/KotnurVersus.Web.csproj", "KotnurVersus.Web/"]
COPY ["backend/Domain/Domain.csproj", "Domain/"]
COPY ["backend/Core/Core.csproj", "Core/"]
COPY ["backend/Db/Db.csproj", "Db/"]
COPY ["backend/Models/Models.csproj", "Models/"]
RUN dotnet restore "KotnurVersus.Web/KotnurVersus.Web.csproj"
COPY ./backend/ .
WORKDIR "/src/KotnurVersus.Web"
RUN dotnet build "KotnurVersus.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "KotnurVersus.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=build_frontend /app/dist/ ./wwwroot
RUN rm -rf /app/config
ENTRYPOINT ["dotnet", "KotnurVersus.Web.dll"]
