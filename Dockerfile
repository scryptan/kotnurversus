FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 4000

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["backend/KotnurVersus.Web/KotnurVersus.Web/KotnurVersus.Web.csproj", "KotnurVersus.Web/"]
COPY ["backend/KotnurVersus.Web/Domain/Domain.csproj", "Domain/"]
COPY ["backend/KotnurVersus.Web/Core/Core.csproj", "Core/"]
COPY ["backend/KotnurVersus.Web/Db/Db.csproj", "Db/"]
COPY ["backend/KotnurVersus.Web/Models/Models.csproj", "Models/"]
RUN dotnet restore "KotnurVersus.Web/KotnurVersus.Web.csproj"
COPY . .
WORKDIR "/src/KotnurVersus.Web"
RUN dotnet build "KotnurVersus.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "KotnurVersus.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "KotnurVersus.Web.dll"]
