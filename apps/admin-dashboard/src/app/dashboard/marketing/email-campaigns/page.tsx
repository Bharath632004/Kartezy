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