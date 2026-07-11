<TextField
            label="Target Audience"
            select
            labelId="edit-target-audience-label"
            id="edit-target-audience-select"
            value={selectedCampaign?.targetAudience || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, targetAudience: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value="all_users">All Users</MenuItem>
            <MenuItem value="active_users">Active Users (Last 30 days)</MenuItem>
            <MenuItem value="new_users">New Users (Last 7 days)</MenuItem>
            <MenuItem value="inactive_users">Inactive Users (Last 30+ days)</MenuItem>
            <MenuItem value="high_value">High Value Users</MenuItem>
          </TextField>
          <TextField
            label="Send Time"
            type="datetime-local"
            value={selectedCampaign?.sendTime || ''}
            onChange={(e) => {
              if (selectedCampaign) {
                setSelectedCampaign({ ...selectedCampaign, sendTime: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />