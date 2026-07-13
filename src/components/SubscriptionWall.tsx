import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Divider,
  Stack,
  Card,
  CardContent
} from '@mui/material';
import { Lock, Payment } from '@mui/icons-material';
import { db } from '../db/db';
import { CheckoutDialog } from './CheckoutDialog';

interface SubscriptionWallProps {
  children: React.ReactNode;
  dbRevision: number;
  triggerDbUpdate: () => void;
}

export const SubscriptionWall: React.FC<SubscriptionWallProps> = ({ children, dbRevision, triggerDbUpdate }) => {
  const [trialStart, setTrialStart] = useState<string | null>(localStorage.getItem('dc_trial_start'));
  const [isSubscribed, setIsSubscribed] = useState<boolean>(localStorage.getItem('dc_is_subscribed') === 'true');
  const [daysLeft, setDaysLeft] = useState<number>(7);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);

  useEffect(() => {
    const checkStatus = () => {
      const start = localStorage.getItem('dc_trial_start');
      const sub = localStorage.getItem('dc_is_subscribed') === 'true';
      setTrialStart(start);
      setIsSubscribed(sub);

      if (sub) {
        setIsExpired(false);
        return;
      }

      if (start) {
        const elapsedDays = (Date.now() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);
        const remaining = 7 - Math.floor(elapsedDays);
        setDaysLeft(Math.max(0, remaining));
        setIsExpired(elapsedDays >= 7);
      } else {
        setIsExpired(false); // Haven't started trial yet, will show "Start Trial" screen
      }
    };
    checkStatus();
  }, [dbRevision]);

  const handleStartTrial = () => {
    const now = new Date().toISOString();
    localStorage.setItem('dc_trial_start', now);
    setTrialStart(now);
    setDaysLeft(7);
    setIsExpired(false);
    triggerDbUpdate();
  };

  const handleSubscribeSuccess = (transactionId: string) => {
    db.recordSubscription('default-user', 'Professional', 6000, 'PhonePe UPI', transactionId);
    setIsSubscribed(true);
    setIsExpired(false);
    setShowCheckout(false);
    triggerDbUpdate();
  };

  // 1. Render Normal App if Subscribed or Trial Active
  const hasAccess = isSubscribed || (trialStart && !isExpired);

  if (hasAccess) {
    return <>{children}</>;
  }

  // 2. Lock screen: Start Trial Screen (if trialStart is null)
  if (!trialStart) {
    return (
      <Box sx={{ 
        bgcolor: '#0b0f19', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 3,
        color: '#fff'
      }}>
        <Paper sx={{ 
          p: 5, 
          maxWidth: 500, 
          width: '100%', 
          bgcolor: '#0f172a', 
          border: '2px solid #312e81', 
          borderRadius: 5, 
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <Box sx={{ fontSize: 60, mb: 2 }}>🛋️</Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#818cf8' }}>
            Welcome to DecoCraft
          </Typography>
          <Typography sx={{ color: '#9ca3af', mb: 4 }}>
            Please activate your subscription or free trial to launch the invoice dashboard.
          </Typography>

          <Stack spacing={3}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', color: '#fff' }}>
              <CardContent sx={{ py: 3, px: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#34d399', mb: 1 }}>
                  1-Week Free Trial
                </Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  Full, unrestricted access to POS, routing, and reporting for 7 days.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={handleStartTrial}
                  sx={{ mt: 2, bgcolor: '#34d399', '&:hover': { bgcolor: '#059669' }, color: '#000', fontWeight: 700 }}
                >
                  Start 1-Week Free Trial
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #4f46e5', color: '#fff' }}>
              <CardContent sx={{ py: 3, px: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#818cf8', mb: 1 }}>
                  Professional Plan
                </Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af', mb: 1 }}>
                  ₹6,000 / month flat subscription.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => setShowCheckout(true)}
                  sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' }, fontWeight: 700 }}
                >
                  Subscribe for ₹6,000/Month
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Paper>

        {/* Checkout Modal */}
        <CheckoutDialog
          open={showCheckout}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleSubscribeSuccess}
          amount={6000}
          planName="Professional"
        />
      </Box>
    );
  }

  // 3. Lock screen: Trial Expired Screen
  return (
    <Box sx={{ 
      bgcolor: '#0b0f19', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      p: 3,
      color: '#fff'
    }}>
      <Paper sx={{ 
        p: 5, 
        maxWidth: 500, 
        width: '100%', 
        bgcolor: '#0f172a', 
        border: '2px solid #ef4444', 
        borderRadius: 5, 
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        <Box sx={{ color: '#ef4444', mb: 2 }}>
          <Lock sx={{ fontSize: 60 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#ef4444' }}>
          Free Trial Expired
        </Typography>
        <Typography sx={{ color: '#9ca3af', mb: 4 }}>
          Your 1-week free trial has completed. To continue using DecoCraft billing and route optimizations, unlock access below.
        </Typography>

        <Button 
          variant="contained" 
          size="large"
          fullWidth
          onClick={() => setShowCheckout(true)}
          startIcon={<Payment />}
          sx={{ 
            bgcolor: '#4f46e5', 
            '&:hover': { bgcolor: '#4338ca' }, 
            py: 1.8, 
            fontWeight: 700, 
            borderRadius: 3 
          }}
        >
          Subscribe for ₹6,000/Month
        </Button>
      </Paper>

      {/* Checkout Modal */}
      <CheckoutDialog
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handleSubscribeSuccess}
        amount={6000}
        planName="Professional"
      />
    </Box>
  );
};
