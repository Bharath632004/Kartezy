{[
                  { name: 'Overview', href: '/dashboard' },
                  { name: 'Fleet', href: '/dashboard/fleet' },
                  { name: 'Orders', href: '/dashboard/orders' },
                  { name: 'Customers', href: '/dashboard/customers' },
                  { name: 'Merchants', href: '/dashboard/merchants' },
                  { name: 'Delivery', href: '/dashboard/delivery' },
                ].map((subItem) => (
                  <ListItem key={subItem.name} sx={{ pl: 4 }}>
                    <ListItemButton
                      component="a"
                      href={subItem.href}
                      sx={{
                        color: 'inherit',
                        textAlign: 'left',
                        ...(pathname === subItem.href && { backgroundColor: 'rgba(255,255,255,0.15)' }),
                      }}
                    >
                      {subItem.name}
                    </ListItemButton>
                  </ListItem>
                ))}