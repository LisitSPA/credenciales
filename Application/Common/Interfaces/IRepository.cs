using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Domain.Common;
using Microsoft.EntityFrameworkCore.Storage;

namespace Application.Common.Interfaces
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> GetAll();
        Task<bool> AllAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken);
        IQueryable<T> GetAllIncluding(params Expression<Func<T, object>>[] includeProperties);
        Task<IEnumerable<T>> GetByConditionsAsync(Expression<Func<T, bool>> expression);
        IQueryable<T> GetAllActive();
        T Add(T entity);
        void AddRange(List<T> entities);
        void AddAsync(T entity);
        void AddRangeSync(T[] entities);
        void Update(T entity);
        Task DeleteSync(int id);
        void DeleteRangeSync(T[] entities);
        void DeactivateSync(int id);
        void Deactivate(T entity);
        Task<T> GetByIdAsync(int id);
        Task<T> GetByIdAsync(string id);
        bool Save();
        Task<bool> SaveSync(CancellationToken cancellationToken);
        Task<List<T>> ToListAsync();

        List<Dictionary<string, object>> ExecuteReaderDictionary(string command);

        List<Dictionary<string, object>> ExecuteReaderDictionary(string command, Dictionary<string, object> parameters);

        int ExecuteNonQuery(string command);
        int ExecuteNonQuery(string command, Dictionary<string, object> parameters);
        IDbContextTransaction BeginTransaction();
        Task<IEnumerable<T>> ExecuteStoreProcedure(string storeProcedure, SqlParameter[] parameters);

    }
}