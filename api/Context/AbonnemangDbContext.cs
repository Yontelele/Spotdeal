using api.Helpers;
using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace api.Context;

/// <summary>
/// Databaskontext
/// </summary>
public class AbonnemangDbContext : DbContext
{
    /// <summary>
    /// Databastabell för användare som ska nyttja plattformen
    /// </summary>
    public DbSet<User> Users { get; set; }

    /// <summary>
    /// Databastabell för varuhus som ska nyttja plattformen
    /// </summary>
    public DbSet<Store> Stores { get; set; }

    /// <summary>
    /// Databastabell för telefoner som ska kunna säljas
    /// </summary>
    public DbSet<Phone> Phones { get; set; }

    /// <summary>
    /// Databastabell för att spara alla ordrar
    /// </summary>
    public DbSet<Order> Orders { get; set; }

    /// <summary>
    /// Databastabell för de företag som ska nyttja plattformen
    /// </summary>
    public DbSet<Company> Companies { get; set; }

    /// <summary>
    /// Databastabell för de operatörer som ska gå att sälja
    /// </summary>
    public DbSet<Operator> Operators { get; set; }

    /// <summary>
    /// Databastabell för att spara alla kontrakt kopplade till order
    /// </summary>
    public DbSet<Contract> Contracts { get; set; }

    /// <summary>
    /// Databastabell för de abonnemang som ska gå att sälja
    /// </summary>
    public DbSet<Abonnemang> Abonnemang { get; set; }

    /// <summary>
    /// Databastabell för de bredband som ska gå att sälja
    /// </summary>
    public DbSet<Bredband> Bredband { get; set; }

    /// <summary>
    /// Databastabell för de TV och Streaming paketet som ska gå att sälja
    /// </summary>
    public DbSet<TvStreaming> TvStreaming { get; set; }

    /// <summary>
    /// Databastabell för de spotdeals som är aktiva
    /// </summary>
    public DbSet<SpotDeal> SpotDeals { get; set; } 

    /// <summary>
    /// Databastabell för de kontraktkoder som ska kopieras in i säljsystemet
    /// </summary>
    public DbSet<ContractCode> ContractCodes { get; set; }

    /// <summary>
    /// Databastabell för de kontraktkoder som ska kopieras in i säljsystemet vid delbetalning av telefon
    /// </summary>
    public DbSet<Delbetalningskod> Delbetalningskoder { get; set; }

    /// <summary>
    /// Databastabell för de subventionskoder som ska kopieras in i säljsystemet
    /// </summary>
    public DbSet<Subventionskod> Subventionskoder { get; set; }

    /// <summary>
    /// Databastabell som kopplar ihop subventionskod med abonnemang och eventuell telefon
    /// </summary>
    public DbSet<Subventionskoppling> Subventionskopplingar { get; set; }

    /// <summary>
    /// Databastabell för att spara alla budgets
    /// </summary>
    public DbSet<Budget> Budgets { get; set; }

    /// <summary>
    /// Skapar en instans av AbonnemangDbContext med angivna databasalternativ.
    /// </summary>
    /// <param name="dbContextOptions">Alternativ som används för att konfigurera databasanslutningen.</param>
    public AbonnemangDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions) { }

    /// <summary>
    /// Asynkront sparar alla ändringar gjorda till databasen.
    /// Skapar CreatedAt och uppdaterar UpdatedAt
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        AddTimestamp();
        return await base.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Sparar alla ändringar gjorda till databasen <br/>
    /// Skapar CreatedAt och uppdaterar UpdatedAt
    /// </summary>
    public override int SaveChanges()
    {
        AddTimestamp();
        return base.SaveChanges();
    }

    private void AddTimestamp()
    {
        IEnumerable<EntityEntry>? changedEntries = ChangeTracker.Entries().Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (EntityEntry? entry in changedEntries)
        {
            DateTime dateNow = DateTimeHelper.GetSwedishTime();

            ((BaseEntity)entry.Entity).UpdatedAt = dateNow;
            if (entry.State == EntityState.Added)
            {
                ((BaseEntity)entry.Entity).CreatedAt = dateNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Property("CreatedAt").IsModified = false;
            }
        }
    }

    /// <summary>
    /// Anpassar standardkonventionerna för ModelBuilder för att konfigurera databasmodellen för kontexten.
    /// </summary>
    /// <param name="modelBuilder">En instans av ModelBuilder som används för att definiera och konfigurera databasmodellen.</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Company>().HasIndex(c => c.Name).IsUnique();

        modelBuilder.Entity<Abonnemang>().HasOne(a => a.Operator).WithMany(o => o.Abonnemang).HasForeignKey(a => a.OperatorId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Bredband>().HasOne(b => b.Operator).WithMany(o => o.Bredband).HasForeignKey(b => b.OperatorId).OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<TvStreaming>().HasOne(t => t.Operator).WithMany(o => o.TvStreaming).HasForeignKey(t => t.OperatorId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Store>().HasOne(s => s.Company).WithMany(c => c.Stores).HasForeignKey(s => s.CompanyId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Store>().HasIndex(s => new { s.CompanyId, s.Name }).IsUnique();

        modelBuilder.Entity<User>().HasOne(u => u.Store).WithMany(s => s.Users).HasForeignKey(u => u.StoreId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<string>();
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

        modelBuilder.Entity<Budget>().HasOne(b => b.Store).WithMany(s => s.Budgets).HasForeignKey(b => b.StoreId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Budget>().HasOne(b => b.Operator).WithMany(o => o.Budgets).HasForeignKey(b => b.OperatorId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Budget>().HasIndex(b => new { b.StoreId, b.OperatorId, b.Year, b.Month }).IsUnique();

        modelBuilder.Entity<Order>().HasOne(o => o.User).WithMany(u => u.Orders).HasForeignKey(o => o.UserId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Order>().HasOne(o => o.Store).WithMany(s => s.Orders).HasForeignKey(o => o.StoreId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Order>().Property(o => o.Status).HasConversion<string>();
        modelBuilder.Entity<Order>().Property(o => o.ContractType).HasConversion<string>();
        modelBuilder.Entity<Order>().HasIndex(o => new { o.StoreId, o.CreatedAt });
        
        modelBuilder.Entity<SpotDeal>().HasOne(s => s.Abonnemang).WithMany(a => a.SpotDeals).HasForeignKey(s => s.AbonnemangId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<SpotDeal>().HasOne(s => s.Phone).WithMany().HasForeignKey(s => s.PhoneId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<SpotDeal>().HasIndex(s => new { s.AbonnemangId, s.PhoneId }).IsUnique();

        modelBuilder.Entity<Contract>().HasOne(c => c.Order).WithMany(o => o.Contracts).HasForeignKey(c => c.OrderId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Contract>().HasOne(c => c.Abonnemang).WithMany(a => a.Contracts).HasForeignKey(c => c.AbonnemangId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Contract>().HasOne(c => c.Bredband).WithMany(b => b.Contracts).HasForeignKey(c => c.BredbandId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Contract>().HasOne(c => c.TvStreaming).WithMany(t => t.Contracts).HasForeignKey(c => c.TvStreamingId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Contract>().HasOne(c => c.CancelledByUser).WithMany(u => u.CancelledContracts).HasForeignKey(c => c.CancelledByUserId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ContractCode>().HasOne(c => c.Operator).WithMany(o => o.ContractCodes).HasForeignKey(c => c.OperatorId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<ContractCode>().Property(c => c.CodeType).HasConversion<string>();
        modelBuilder.Entity<ContractCode>().HasIndex(c => new { c.OperatorId, c.CodeType }).IsUnique();

        modelBuilder.Entity<Delbetalningskod>().HasOne(d => d.Operator).WithMany(o => o.Delbetalningskoder).HasForeignKey(a => a.OperatorId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Delbetalningskod>().HasIndex(d => d.Code).IsUnique();

        modelBuilder.Entity<Subventionskod>().HasIndex(s => s.Code).IsUnique();
        modelBuilder.Entity<Subventionskod>().Property(s => s.ValidFrom).HasColumnType("date");
        modelBuilder.Entity<Subventionskod>().Property(s => s.ValidTo).HasColumnType("date");
        modelBuilder.Entity<Subventionskod>().ToTable(s => s.HasCheckConstraint("CK_Subvention_Dates", "[ValidFrom] <= [ValidTo]"));

        modelBuilder.Entity<Subventionskoppling>().HasIndex(k => new { k.SubventionskodId, k.AbonnemangId, k.PhoneId }).HasFilter("[PhoneId] IS NOT NULL").IsUnique();
        modelBuilder.Entity<Subventionskoppling>().HasIndex(k => new { k.SubventionskodId, k.AbonnemangId }).HasFilter("[PhoneId] IS NULL").IsUnique();
        modelBuilder.Entity<Subventionskoppling>().HasOne(k => k.Subventionskod).WithMany(s => s.Subventionskopplingar).HasForeignKey(k => k.SubventionskodId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Subventionskoppling>().HasOne(k => k.Abonnemang).WithMany(a => a.Subventionskopplingar).HasForeignKey(k => k.AbonnemangId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Subventionskoppling>().HasOne(k => k.Phone).WithMany().HasForeignKey(k => k.PhoneId).OnDelete(DeleteBehavior.Cascade).IsRequired(false);

        base.OnModelCreating(modelBuilder);
    }
}
