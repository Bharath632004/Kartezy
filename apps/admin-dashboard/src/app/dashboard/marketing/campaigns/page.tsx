<TextField
            label="End Date"
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            sx={{ width: 150 }}
          />