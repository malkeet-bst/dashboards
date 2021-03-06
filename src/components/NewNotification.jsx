import React from "react";
import If from "./common/If";
import GlobalActions from "../actions/GlobalActions";

import BellNotification from "./BellNotification";


class NewNotification extends React.Component {

  onChannelSelection = () => {
    if (document.getElementById('notification-form')) {
      document.getElementById('notification-form').style.display = 'block'
    }
    GlobalActions.saveFormData({});
    GlobalActions.clearData()
    GlobalActions.setChannel('bell')
  }

  render() {
    let { show, channelType, formData,apiStatus,cloneData} = this.props;

    return (
      <div>
        <If condition={show}>
          <div className="new">
            <header><h2>Create New Notification</h2></header>
           <If condition={channelType=='dashboard'}>
              <section>
                <h4> Select Channel</h4>
                <article className="channel-box">
                  <div className="channel" onClick={() => this.onChannelSelection('bell')}>
                    <h5>Bell Notifications</h5>
                    <span>Send out Bell/ribbon Notifications based on specific Profile Attributes of the User</span>
                  </div>
                  <div className="channel">
                    <h5>Dormant Message</h5>
                    <span>Coming Soon</span>
                  </div>
                </article>
              </section>
            </If>
          </div>
          {/* <If condition={apiStatus != null && apiStatus.success != null}>
          <div className="alert alert-success" style={{'marginTop':'30px'}}>
            <strong>Success!</strong> {apiStatus && apiStatus.success}
          </div>
        </If> */}
          <If condition={channelType === 'bell'}>
            <BellNotification apiStatus ={apiStatus} cloneData={cloneData} formData={formData}/>
          </If>
          <If condition={apiStatus == "loading"}>
          <div className="page-loader" />
        </If>
        </If>
      </div>
    );
  }
}

export default NewNotification;
