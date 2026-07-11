<Box>
                  <Typography variant="body2" fontWeight="medium">
                    Status
                  </Typography>
                  <Typography>
                    <Chip
                      label={kycInfo.status}
                      size="small"
                      color={kycInfo.status === 'approved' ? 'success' :
                             kcInfo.status === 'pending' ? 'warning' :
                             kcInfo.status === 'rejected' ? 'error' : 'default'}
                    />
                  </Typography>
                </Box>