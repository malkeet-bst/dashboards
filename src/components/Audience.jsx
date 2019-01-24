import React from "react";
import If from './common/If'
import { Form, Icon, Select, DatePicker, Tooltip, Input } from "antd";
import moment from "moment";
import GlobalActions from "../actions/GlobalActions";
import { confirmAlert } from 'react-confirm-alert';
import ButtonBar from './common/ButtonBar'
import "antd/dist/antd.css";

const { TextArea } = Input;
const RangePicker = DatePicker.RangePicker;


class Audience extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      audience: "",
      apiStatus:'',
      validity: ''
    }
  }
  componentDidMount = () => {
   
    let copyData=this.props.formData
  let validity=[]
 //   if(Object.entries(copyData).length !== 0 && copyData.constructor === Object){

    //  validity.push(moment('2015/01/01', 'YYYY-MM-DD'))
   //   validity.push(moment(copyData.campaign_end_time.split(' ')[0]))
   // }
   this.startTime=moment('2015/01/01', 'YYYY-MM-DD')
    this.setState({audience:copyData.audience})
    
  }
  onChange = (date, dateString) => {
    console.log(date, dateString)
    this.setState({time:dateString})
    this.setState({ validity:dateString,apiStatus:'' });
  }
  changeTab = () => {
    document.getElementById('notification-form').style.display = 'block'
    document.getElementById('audience').style.display = 'none'
    GlobalActions.setCurrentView('home')
  }
  sendClick = () => {
    this.publishCamp()
    // confirmAlert({
    //   title: ``,
    //   message: 'Are you sure you want to schedule this campaign ?',
    //   buttons: [
    //     {
    //       label: 'yes',
    //       onClick: () => this.publishCamp()
    //     },
    //     {
    //       label: 'No'
    //     }
    //   ]
    // })
  }
  uploadCsv = event => {
    this.setState({ csv_file: event.target.files[0], apiStatus:'' });
  };
  updateval = (name, event) => {
    this.setState({ audience: event.target.value,apiStatus:''});
  };
  saveDraft = () => {
    GlobalActions.saveAudienceDraft()
  }
  publishCamp = () => {
    if (this.state.audience && this.state.time && this.state.time[0]) {
      GlobalActions.publishCampaign(this.state.audience, this.state.time, '')
    } else if (this.state.audience && (!this.state.time || !this.state.time[0])) {
      this.setState({ apiStatus: { error: "Validity is mandatory for creating filter" } })
    } else {
      var csv_data
      var fileInput = document.getElementById('csv_uploader');
      if (fileInput && fileInput.files[0]) {
        var reader = new FileReader();
        reader.readAsBinaryString(fileInput.files[0]);
        reader.onload = () => {
          csv_data = reader.result.split(/\r\n|\n/);
          GlobalActions.publishCampaign(this.state.audience, this.state.time, JSON.stringify(csv_data))
        }
      } else {
        this.setState({ apiStatus: { error: "Either upload guid file or enter filter and validity " } })
      }
    }
  }
  render() {
    let { audience, validity } = this.state;
    let {apiStatus}=this.props
    if(this.state.apiStatus){
      apiStatus=this.state.apiStatus
    }
    let dateFormat = 'YYYY-MM-DD'
    //console.log(this.startTime)
    //validity = [this.startTime, moment('2015/01/01', dateFormat)]
    //console.log(validity)
    // [moment('2018-01-11T12:32:26.551Z'),
    //  moment('2018-02-19T12:32:26.551Z')]

    return (
      <div id="audience">
        <If condition={apiStatus != null && apiStatus.error != null}>
          <div className="alert alert-warning">
            <strong>Warning!</strong> {apiStatus && apiStatus.error}
          </div>
        </If>
        <section>
          <h4> Define Audience</h4>
          <form className="form-horizontal">

            <div className="form-group required">
              <label className="control-label col-sm-3 "> Enter audience </label>
              <div className="col-sm-6">
                <TextArea
                  className="hashtags_input form-control"
                  defaultValue={this.props.hashTags}
                  disabled={this.props.isDefaultBanners}
                  value={audience}
                  onChange={this.updateval.bind(this, "audience")}
                  placeholder="Enter hashtags seperated by comma like #country_US,#age-day_0_0 without any spaces in between"
                />
                <div style={{ 'marginTop': '6px' }}><a href="/" target="view_window">Filter ?</a></div>
              </div>
            </div>
            <div className="form-group required">
              <label className="control-label col-sm-3 ">validity </label>
              <div className="col-sm-6">
                <RangePicker onChange={this.onChange}  placeholder={['Start Time', 'End Time']} defaultValue={
                  validity
                }
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </div>
            </div>
            <div style={{'textAlign':'center','fontSize':'27px'}}>OR</div>
            <div className="form-group required">
              <label className="control-label col-sm-3 ">Upload GUID File </label>
              <div className="col-sm-6">
                <input
                  type="file"
                  id="csv_uploader"
                  name="csv_uploader"
                  onChange={this.uploadCsv}
                  accept=".xlsx, .xls, .csv">
                </input>
              </div>
              {/* <div className="col-sm-3">
                <button
                  type="button"
                  onClick={this.saveDraft}
                  className="btn btn-warning btn-md"
                >
                  <span> Test Csv</span>
                </button>
                </div> */}
            </div>

            <ButtonBar nextString="Send" backClick={this.changeTab} saveClick={this.saveDraft} nextClick={() => this.sendClick('audience')} />
          </form>
        </section>
      </div>
    );
  }
}

export default Audience;
