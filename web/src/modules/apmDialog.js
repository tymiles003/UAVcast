import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class ApmDownloadDialog extends Component {
    constructor(props){
        super(props)

        this.state = {
            open: false,
          };
    }
     
    
      handleOpen = () => {
        this.setState({open: true});
      };
    
      handleClose = () => {
        this.setState({open: false});
      };
    
      render() {
        const actions = [
          <FlatButton
            label="Download"
            primary={true}
            keyboardFocused={true}
            onClick={this.props.download}
          />,
            <FlatButton
            label="Cancel"
            primary={true}
            onClick={this.props.close}
            />,
        ];
    
        return (
          <div>
            <Dialog
              title="APM Binary Download"
              actions={actions}
              modal={false}
              open={this.props.open}
              onRequestClose={this.handleClose}
            >
              The selected model is not yet downloded. <br /> 
              Do you want to download <b>{'Ardu'+this.props.binary}</b> now?
            </Dialog>
          </div>
        );
    }
}


export default ApmDownloadDialog;