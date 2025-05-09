import React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Type assertion để khắc phục lỗi TypeScript
const DashboardPage: React.FC = () => {
  const { households } = useSelector((state: RootState) => state.household);
  const { residents } = useSelector((state: RootState) => state.resident);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tổng quan
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3} {...({ item: true } as any)}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số hộ khẩu
              </Typography>
              <Typography variant="h4">
                {households.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3} {...({ item: true } as any)}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số nhân khẩu
              </Typography>
              <Typography variant="h4">
                {residents.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;