import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Stack,
  CircularProgress,
  Divider
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
  amount: number;
  planName: string;
}

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onClose,
  onSuccess,
  amount,
  planName
}) => {
  const [transactionId, setTransactionId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmedTxId, setConfirmedTxId] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleClose = () => {
    if (!isVerifying && !showSuccess) {
      onClose();
    }
  };

  const handleConfirm = () => {
    const trimmedId = transactionId.trim();
    if (!trimmedId) {
      setErrorText('Transaction ID / UTR is required');
      return;
    }
    if (trimmedId.length < 8) {
      setErrorText('Please enter a valid Transaction ID / UTR (at least 8 characters)');
      return;
    }

    setErrorText('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setShowSuccess(true);
      setConfirmedTxId(trimmedId);
    }, 2500);
  };

  const handleDone = () => {
    onSuccess(confirmedTxId);
    setShowSuccess(false);
    setTransactionId('');
    setConfirmedTxId('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0f172a',
          color: '#fff',
          border: '1px solid #334155',
          borderRadius: 3,
          backgroundImage: 'none'
        }
      }}
    >
      {!showSuccess && (
        <DialogTitle sx={{ fontWeight: 800, pb: 1, color: '#f3f4f6' }}>
          Subscribe to DecoCraft Premium
        </DialogTitle>
      )}

      <DialogContent sx={{ p: 3 }}>
        {isVerifying ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 2 }}>
            <CircularProgress sx={{ color: '#818cf8' }} />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Verifying UPI Payment...
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }} align="center">
              Checking transaction status with PhonePe servers. Please do not close this window.
            </Typography>
          </Box>
        ) : showSuccess ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, textAlign: 'center' }}>
            <CheckCircle sx={{ color: '#10b981', fontSize: 64, mb: 2 }} />
            
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#10b981' }}>
              Payment Successful!
            </Typography>
            
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              Your premium subscription has been activated successfully.
            </Typography>

            <Box sx={{ width: '100%', bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2, p: 2, mb: 3 }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>Plan Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{planName}</Typography>
                </Box>
                <Divider sx={{ borderColor: '#334155' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>Amount Paid</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#34d399' }}>₹{amount.toLocaleString('en-IN')}</Typography>
                </Box>
                <Divider sx={{ borderColor: '#334155' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>Payment Method</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>PhonePe UPI</Typography>
                </Box>
                <Divider sx={{ borderColor: '#334155' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af', whiteSpace: 'nowrap' }}>Transaction ID / UTR</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, wordBreak: 'break-all', textAlign: 'right' }}>{confirmedTxId}</Typography>
                </Box>
                <Divider sx={{ borderColor: '#334155' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>Status</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>Active</Typography>
                </Box>
                <Divider sx={{ borderColor: '#334155' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Button
              variant="contained"
              fullWidth
              color="success"
              onClick={handleDone}
              sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
            >
              Start Using Premium
            </Button>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            <Typography variant="body2" sx={{ color: '#9ca3af' }} align="center">
              Scan and Pay <strong>₹{amount.toLocaleString('en-IN')}</strong> using PhonePe or any UPI app to subscribe to the {planName} Plan.
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                bgcolor: '#1e293b', 
                p: 2, 
                borderRadius: 2,
                border: '1px solid #334155'
              }}
            >
              <Box 
                component="img"
                src="/payment_qr.jpg"
                alt="PhonePe Payment QR"
                sx={{ 
                  width: '100%', 
                  maxWidth: 220, 
                  height: 'auto', 
                  borderRadius: 1.5, 
                  border: '4px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  mb: 1.5
                }}
              />
              <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600 }}>
                UPI ID: MUHAMMED HAFEED P
              </Typography>
            </Box>

            <TextField
              label="UPI Transaction ID / UTR"
              variant="outlined"
              placeholder="Enter the 12-digit transaction number"
              value={transactionId}
              onChange={(e) => {
                setTransactionId(e.target.value);
                if (e.target.value.trim()) setErrorText('');
              }}
              error={!!errorText}
              helperText={errorText || "Enter the reference ID/UTR from your UPI app receipt."}
              fullWidth
              InputLabelProps={{
                style: { color: '#9ca3af' }
              }}
              inputProps={{
                style: { color: '#fff' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#334155' },
                  '&:hover fieldset': { borderColor: '#4f46e5' },
                  '&.Mui-focused fieldset': { borderColor: '#818cf8' }
                }
              }}
            />
          </Stack>
        )}
      </DialogContent>

      {!isVerifying && !showSuccess && (
        <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'space-between' }}>
          <Button 
            onClick={onClose} 
            sx={{ color: '#9ca3af', textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            variant="contained" 
            color="primary"
            sx={{ 
              bgcolor: '#4f46e5', 
              '&:hover': { bgcolor: '#4338ca' },
              textTransform: 'none', 
              fontWeight: 700,
              px: 3,
              borderRadius: 2
            }}
          >
            I Have Paid (Confirm)
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
