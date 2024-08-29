import * as React from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {XCircle as XCircleIcon} from "@phosphor-icons/react/dist/ssr/XCircle";
import {CheckCircle as CheckCircleIcon} from "@phosphor-icons/react/dist/ssr/CheckCircle";
import Dialog from "@mui/material/Dialog";


interface QuestionNewDialogProps {
  openDialog: boolean;
  handleDialogClose: () => void;
  handleDialogConfirm: () => void;
}

export function QuestionNewDialog({ openDialog, handleDialogClose, handleDialogConfirm }: QuestionNewDialogProps): React.JSX.Element {

    return (
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Submission"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography component='span'>
              Are you sure you want to create these questions for this quest?
            </Typography>
          </DialogContentText>
          <DialogContentText id="alert-dialog-description" sx={{pb:1}}>
            <Typography component='span'>These questions</Typography>
            <Typography fontWeight={600} component='span'> cannot be edited</Typography>
            <Typography component='span'> or</Typography>
            <Typography fontWeight={600} component='span'> deleted</Typography>
            <Typography component='span'> once they are created for this quest.</Typography>
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="body2" component='span'>*Note: To edit these questions, the quest will have to be deleted and recreated.</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="error" startIcon={<XCircleIcon />} >
            Cancel
          </Button>
          <Button onClick={handleDialogConfirm} color="primary" variant="contained" startIcon={<CheckCircleIcon />}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );

}
