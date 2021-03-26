import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Grid, Loader } from 'semantic-ui-react'
import { InputGroupButtonDropdown } from 'reactstrap';
import "./Measurements.css";

var divStatusLabelStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    backgroundColor: 'yellow'
};

interface IProps {
    measurements: IMeasurements;
    update: boolean;
    type: string;
    updateMeasurements: Function;
    height: number;
}

interface IMeasurements {
    neck: number;
    upperArm: number;
    waist: number;
    hips: number;
    thigh: number;
    chest: number;
    weight: number;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
    neck: number;
    upperArm: number;
    waist: number;
    hips: number;
    thigh: number;
    chest: number;
    weight: number;
    bodyfat: number;
    selected: number;
    dirty: boolean;
    startTime: Date;
    showProgress: boolean;
}

class Measurements3DViewer extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false, neck: 0.0, upperArm:0.0, waist: 0.0,
            hips: 0.0, thigh: 0.0, chest: 0.0, weight: 0.0, bodyfat: 0.0,
            selected: 0, dirty: false, startTime: new Date(), showProgress: false
        };
    }

    public componentDidMount() {
        this.setState({
            neck: this.props.measurements.neck,
            waist: this.props.measurements.waist,
            hips: this.props.measurements.hips,
            thigh: this.props.measurements.thigh,
            chest: this.props.measurements.chest,
            weight: this.props.measurements.weight
        });
    }

    showProgress = (show: boolean) => {
        if (show) {
            return (<Grid.Row>
                <Grid.Column>
                    <Loader active inline='centered'>3D Scanning In Progress...</Loader>
                </Grid.Column>
            </Grid.Row>);
        }
        else {
            return (<Grid.Row>
                <Grid.Column>
                    <div style={divStatusLabelStyle}><a>Disclaimer: The 3D model does NOT represent the actual person. This is an estimation based on basic body measurements</a></div>
                </Grid.Column>
            </Grid.Row>);
        }
    }

    render() {
        if (this.props.update !== this.state.dirty)
        {
            this.setState({
                neck: this.props.measurements.neck,
                upperArm: this.props.measurements.upperArm,
                waist: this.props.measurements.waist,
                hips: this.props.measurements.hips,
                thigh: this.props.measurements.thigh,
                chest: this.props.measurements.chest,
                weight: this.props.measurements.weight,
                dirty: this.props.update
            });
        }

        if (this.state.updated === true) {
            this.setState({ updated: false });
            this.props.updateMeasurements({ neck: this.state.neck, waist: this.state.waist, upperArm: this.state.upperArm, hips: this.state.hips, thigh: this.state.thigh, chest: this.state.chest, weight: this.state.weight });
        }

        var values = 'Neck=' + this.state.neck * 2.54 + '&Chest=' + this.state.chest * 2.54 + '&Waist=' + this.state.waist * 2.54 + '&Hips=' + this.state.hips * 2.54 + '&Height=' + this.props.height + '&Thigh=' + this.state.thigh * 2.54;
        var url = 'bodyapps-viz-master/female.html?' + values;

        var currTime = new Date();
        var seconds = Math.abs((this.state.startTime.getTime() - currTime.getTime()) / 1000);
        console.log('time 1: '+ seconds);

        if (this.state.showProgress && seconds < 4) {
            setTimeout(() => {
                this.setState({ showProgress: false });
            }, 4000);
        }

        currTime = new Date();
        seconds = Math.abs((this.state.startTime.getTime() - currTime.getTime()) / 1000);
        console.log('time 2: ' + seconds);
        var showProgress = true;
        if (seconds < 4) {
            if (!this.state.showProgress) {
                this.setState({ showProgress: true });
            }
        }
        else if (!this.state.showProgress) {
            this.setState({ showProgress: true });
            showProgress = false;
        }
        else {
            showProgress = false;
        }

        console.log('--> ' + showProgress);
        return (
            <Grid centered>
                {this.showProgress(showProgress)}
                <Grid.Row stretched>
                    <Grid.Column>
                        <iframe src={url} className="Viewer" />
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(Measurements3DViewer);