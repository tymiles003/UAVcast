import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class Shutdown extends Component {
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
            label={this.props.yesLabel}
            primary={true}
            keyboardFocused={true}
            onClick={() => this.props.yes()}
          />,
            <FlatButton
            label={this.props.noLabel}
            primary={true}
            onClick={() => this.props.no()}
            />,
        ];
    
        return (
          <div>
            <Dialog
              title={this.props.title}
              actions={actions}
              modal={false}
              open={this.props.open}
              onRequestClose={this.handleClose}
            >
             {this.props.content}
            </Dialog>
          </div>
        );
    }
}
export default Shutdown;