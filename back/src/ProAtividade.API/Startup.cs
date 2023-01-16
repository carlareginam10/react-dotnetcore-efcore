using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using ProAtividade.API.Data;
using Microsoft.EntityFrameworkCore; 
using System.Text.Json.Serialization;

namespace ProAtividade.API
{
    public class Startup
    {

        //esse configuration acessa os arquivos de configuração appssettings.json e
        // appssettings.Development.json
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //add o contexto de banco de dados criado no DataContext
            services.AddDbContext<DataContext>(
                //de acordo com as opções que tenho dentro do EntityFrameworkCore escolho o sqlite
                //como a aplicação inicia aqui no Startup quande ele ler o 
                //Configuration ele vai procurar nos arquivos  appssettings.json e
                //appssettings.Development.json uma ConnectionString "Default"
                //o DataContext também deve ser referenciado no AtividadeController linha 16
                options => options.UseSqlite(Configuration.GetConnectionString("Default"))
            );

            //Ja existia o services.AddControllers() as demais linhas add foram usadas para converter
            //a prioridade de inteiro para string, retornando assim o nome da prioridade no card.
            //essa parte é uma opção do proprio framework, não precisei mecher no Enum
            services.AddControllers().AddJsonOptions(options => 
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                }
            );      
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ProAtividade.API", Version = "v1" });
            });

            //necessário para que o front consiga acessar o back
            //sem essa linha retorna erro no front 'hasbeen blocked by CORS policy'
            services.AddCors();
        }
        

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProAtividade.API v1"));
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            //configurando o CORS
            app.UseCors(option =>option.AllowAnyHeader()
                                        .AllowAnyMethod()
                                        .AllowAnyOrigin());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
