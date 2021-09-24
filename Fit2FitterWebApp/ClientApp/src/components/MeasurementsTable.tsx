import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Grid, Image } from 'semantic-ui-react'
import { InputGroupButtonDropdown } from 'reactstrap';

interface IProps {
    measurements: IMeasurements;
    update: boolean;
    type: string;
    updateMeasurements: Function;
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
}

class MeasurementsTable extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false, neck: 0.0, upperArm:0.0, waist: 0.0,
            hips: 0.0, thigh: 0.0, chest: 0.0, weight: 0.0, bodyfat: 0.0,
            selected: 0, dirty: false
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

    getColour = (total: number) => {
        if (total > 50.0 && total < 100) {
            return 'orange';
        }

        if (total === 100) {
            return 'teal';
        }

        if (total > 100.0) {
            return 'red';
        }

        return 'black';
    }

    updateNeck = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ neck: event.target.value, updated: true });
        }
    }

    updateUpperArm = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ upperArm: event.target.value, updated: true });
        }
    }

    updateWaist = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ waist: event.target.value, updated: true });
        }
    }

    updateHips = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ hips: event.target.value, updated: true });
        }
    }

    updateThigh = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ thigh: event.target.value, updated: true });
        }
    }

    updateChest = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ chest: event.target.value, updated: true });
        }
    }

    updateWeight = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ weight: event.target.value, updated: true });
        }
    }

    onFocusNeck = () => {
        this.setState({ selected: 1, updated: true });
    }

    onFocusWaist = () => {
        this.setState({ selected: 2, updated: true });
    }

    onFocusHips = () => {
        this.setState({ selected: 3, updated: true });
    }

    onFocusThigh = () => {
        this.setState({ selected: 4, updated: true });
    }

    onFocusChest = () => {
        this.setState({ selected: 5, updated: true });
    }

    onFocusUpperArm = () => {
        this.setState({ selected: 6, updated: true });
    }

    onFocusWeight = () => {
        this.setState({ selected: 0, updated: true });
    }

    getBodyParts = () => {
        if (this.state.selected === 1) {
            return (
                <div>
                    <Image src="Female-Body-Silhouette-neck.svg" size='medium' />
                </div>
            );
        }

        if (this.state.selected === 2) {
            return (
                <div>
                    <Image src="Female-Body-Silhouette-waist.svg" size='medium' />
                </div>
            );
        }

        if (this.state.selected === 3) {
            return (
                <div>
                    <Image src="Female-Body-Silhouette-hips.svg" size='medium' />
                </div>
            );
        }

        if (this.state.selected === 4) {
            return (
                <div>
                    <Image src="Female-Body-Silhouette-thigh.svg" size='medium' />
                </div>
            );
        }

        if (this.state.selected === 5) {
            return (
                <div>
                    <Image src="Female-Body-Silhouette-chest.svg" size='medium' />
                </div>
            );
        }

        if (this.state.selected === 6) {
            return (
                <div>
                    <Image src="Female-Body-Silhouette-upper-arm.svg" size='medium' />
                </div>
            );
        }

        return (
            <div>
                <Image src="Female-Body-Silhouette-new.svg" size='medium' />
            </div>
            );
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

        return (
            <Grid centered>
                <Grid.Row columns={2} stretched>
                    <Grid.Column width={10}>
                        <Grid.Column as='a' width={4} textAlign='left'/>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h4>All measurements are in inches (in)</h4>
                        </Grid.Column>
                        <Grid.Column as='a' width={4} textAlign='left'>
                            <h5>Neck</h5>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <input value={this.state.neck} onChange={this.updateNeck} placeholder='Neck' onFocus={this.onFocusNeck} />
                        </Grid.Column>
                        <Grid.Column as='a' width={4} textAlign='left'>
                            <h5>Upper Arm</h5>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <input value={this.state.upperArm} onChange={this.updateUpperArm} placeholder='Upper Arm' onFocus={this.onFocusUpperArm} />
                        </Grid.Column>
                        <Grid.Column as='a' width={4} textAlign='left'>
                            <h5>Waist</h5>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <input value={this.state.waist} onChange={this.updateWaist} placeholder='Waist' onFocus={this.onFocusWaist} />
                        </Grid.Column>
                        <Grid.Column as='a' width={4} textAlign='left'>
                            <h5>Hips</h5>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <input value={this.state.hips} onChange={this.updateHips} placeholder='Hips' onFocus={this.onFocusHips} />
                        </Grid.Column>
                        <Grid.Column as='a' width={4} textAlign='left'>
                            <h5>Thigh</h5>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <input value={this.state.thigh} onChange={this.updateThigh} placeholder='Thigh' onFocus={this.onFocusThigh} />
                        </Grid.Column>
                        <Grid.Column as='a' width={4} textAlign='left'>
                            <h5>Chest</h5>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <input value={this.state.chest} onChange={this.updateChest} placeholder='Chest' onFocus={this.onFocusChest} />
                        </Grid.Column>
                        <Grid.Column as='a' width={4} textAlign='left'>
                            <h5>Weight</h5>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <input value={this.state.weight} onChange={this.updateWeight} placeholder='Weight' onFocus={this.onFocusWeight} />
                        </Grid.Column>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        {this.getBodyParts()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(MeasurementsTable);