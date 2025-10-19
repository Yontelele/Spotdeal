using api.Context;
using api.Managers;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.Identity.Web;
using System.Reflection;
using api.Mappings;
using api.Repositories;
using api.Authorization;
using Microsoft.AspNetCore.Authorization;
using api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

AddDependencyInjection();

builder.Services.AddDbContext<AbonnemangDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthorization(options => options.AddPolicy("UserPolicy", policy => policy.Requirements.Add(new UserRequirement())));

builder.Services.AddMicrosoftIdentityWebApiAuthentication(builder.Configuration, "AzureAd");

builder.Services.AddSignalR().AddAzureSignalR(builder.Configuration.GetConnectionString("SignalRConnection"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(swagger =>
{
    swagger.SwaggerDoc("v1", new OpenApiInfo { Title = "Spotdeal API", Description = "Backend för Spotdeal", Version = "v1" });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    swagger.IncludeXmlComments(xmlPath);

    swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Ange 'Bearer' följt av ett mellanslag och JWT-token",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<SignalR>("/signalr").RequireAuthorization("UserPolicy");

app.Run();

void AddDependencyInjection()
{
    builder.Services.AddScoped<AbonnemangManager>();
    builder.Services.AddScoped<AbonnemangRepository>();
    builder.Services.AddScoped<BredbandManager>();
    builder.Services.AddScoped<BredbandRepository>();
    builder.Services.AddScoped<BudgetManager>();
    builder.Services.AddScoped<BudgetRepository>();
    builder.Services.AddScoped<ContractCodesManager>();
    builder.Services.AddScoped<ContractCodesRepository>();
    builder.Services.AddScoped<MobilDealManager>();
    builder.Services.AddScoped<OperatorManager>();
    builder.Services.AddScoped<OperatorRepository>();
    builder.Services.AddScoped<OrderManager>();
    builder.Services.AddScoped<OrderRepository>();
    builder.Services.AddScoped<PhoneManager>();
    builder.Services.AddScoped<PhoneRepository>();
    builder.Services.AddScoped<SpotDealManager>();
    builder.Services.AddScoped<SpotDealRepository>();
    builder.Services.AddScoped<StoreRepository>();
    builder.Services.AddScoped<UserManager>();
    builder.Services.AddScoped<UserRepository>();
    builder.Services.AddScoped<DashboardManager>();
    builder.Services.AddScoped<SignalRManager>();
    builder.Services.AddScoped<TvStreamingManager>();
    builder.Services.AddScoped<TvStreamingRepository>();

    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<IAuthorizationHandler, UserHandler>();
}