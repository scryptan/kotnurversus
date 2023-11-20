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
RUN ls -la
RUN dotnet build "KotnurVersus.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "KotnurVersus.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
RUN rm -rf /app/config
ENTRYPOINT ["dotnet", "KotnurVersus.Web.dll"]
