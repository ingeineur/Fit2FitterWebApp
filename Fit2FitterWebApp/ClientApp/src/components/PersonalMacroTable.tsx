import * as React from 'react';
import { connect } from 'react-redux';
import { Segment, Input, Grid, Dropdown, Image, Loader, Dimmer, Radio } from 'semantic-ui-react';
import RangeSlider from 'react-bootstrap-range-slider';
import { IPersonal } from '../models/clients'

var divLabelStyle = {
    color: 'blue',
    fontSize: '10px',
    verticalAlign: 'middle'
};

interface IProps {
    personal: IPersonal;
    update: boolean;
    type: string;
    updatePersonal: Function
}

interface IState {
    updated: boolean;
    dirty: boolean;
    activityLevel: string;
    macroType: string;
    carbPercent: number;
    proteinPercent: number;
    fatPercent: number;
    carbWeight: number;
    proteinWeight: number;
    fatWeight: number;
    manualMacro: boolean;
}

const activityTypes = [
    {
        key: 'Sedentary',
        text: 'Sedentary',
        value: 'Sedentary'
    },
    {
        key: 'Lightly Active',
        text: 'Lightly Active',
        value: 'Lightly Active'
    },
    {
        key: 'Moderately Active',
        text: 'Moderately Active',
        value: 'Moderately Active'
    },
    {
        key: 'Very Active',
        text: 'Very Active',
        value: 'Very Active'
    },
    {
        key: 'Extra Active',
        text: 'Extra Active',
        value: 'Extra Active'
    }
];

const mealPlan = [
    {
        key: 'Lose Weight',
        text: 'Lose Weight',
        value: 'Lose Weight'
    },
    {
        key: 'Maintain/Muscle Gain',
        text: 'Maintain/Muscle Gain',
        value: 'Maintain/Muscle Gain'
    },
    {
        key: 'Gain Weight',
        text: 'Gain Weight',
        value: 'Gain Weight'
    }
];

class PersonalMacroTable extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            updated: false, activityLevel: 'Sedentary', macroType: 'Lose Weight',
            carbPercent: 10.0, proteinPercent: 40.0, fatPercent: 30.0, dirty: false,
            manualMacro: false, carbWeight: 0.0, proteinWeight: 0.0, fatWeight: 0.0
        };
    }

    public componentDidMount() {
        var imageStatus = '';
        if (this.props.personal.avatar !== '') {
            imageStatus = 'Uploaded'
        }

        this.setState({
            activityLevel: this.getActivityLevelText(this.props.personal.activityLevel),
            macroType: this.getMacroTypeText(this.props.personal.macroType)
        });
    }

    updateCarbWeight = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ carbWeight: event.target.value, updated: true });
        }
    }

    updateProteinWeight = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ proteinWeight: event.target.value, updated: true });
        }
    }

    updateFatWeight = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ fatWeight: event.target.value, updated: true });
        }
    }

    toggleManualMacro = () => {
        this.setState({ manualMacro: !this.state.manualMacro, updated: true });
    }

    getActivityLevelText = (type: number) => {
        if (type === 0) {
            return 'Sedentary';
        }

        if (type === 1) {
            return 'Lightly Active';
        }

        if (type === 2) {
            return 'Moderately Active';
        }

        if (type === 3) {
            return 'Very Active';
        }

        if (type === 4) {
            return 'Extra Active';
        }

        return 'Sedentary';
    }

    getActivityLevel = (text: string) => {
        if (text === 'Sedentary') {
            return 0;
        }

        if (text === 'Lightly Active') {
            return 1;
        }

        if (text === 'Moderately Active') {
            return 2;
        }

        if (text === 'Very Active') {
            return 3;
        }

        if (text === 'Extra Active') {
            return 4;
        }

        return 0;
    }

    setActivityLevel = (event: any, data:any) => {
        this.setState({ updated: true, activityLevel: data['value'] });
    }

    getMacroTypeText = (type: number) => {
        if (type === 0) {
            return 'Lose Weight';
        }

        if (type === 1) {
            return 'Maintain/Muscle Gain';
        }

        if (type === 2) {
            return 'Gain Weight';
        }

        return 'Lose Weight';
    }

    getMacroType = (text: string) => {
        if (text === 'Lose Weight') {
            return 0;
        }

        if (text === 'Maintain/Muscle Gain') {
            return 1;
        }

        if (text === 'Gain Weight') {
            return 2;
        }

        return 0;
    }

    setMacroType = (event: any, data: any) => {
        this.setState({ updated: true, macroType: data['value'] });
        this.setState({ updated: true, carbPercent: this.getMinMaxMacroPortions(data['value'])['carb']['min'] });
        this.setState({ updated: true, proteinPercent: this.getMinMaxMacroPortions(data['value'])['protein']['min'] });
        this.setState({ updated: true, fatPercent: this.getMinMaxMacroPortions(data['value'])['fat']['min'] });
    }

    isPortionsExceeded = (carbPercent: number, proteinPercent: number, fatPercent: number) => {
        if ((carbPercent + proteinPercent + fatPercent) > 100.0) {
            return true;
        }

        return false;
    }

    setCarbPercent = (event: any) => {
        var val = parseFloat(event.target.value);

        if (val < this.getMinMaxMacroPortions(this.state.macroType)['carb']['min']) {
            this.setState({ updated: true, carbPercent: this.getMinMaxMacroPortions(this.state.macroType)['carb']['min'] });
            return;
        }

        if (val > this.getMinMaxMacroPortions(this.state.macroType)['carb']['max']) {
            this.setState({ updated: true, carbPercent: this.getMinMaxMacroPortions(this.state.macroType)['carb']['max'] });
            return;
        }

        if (this.isPortionsExceeded(val, this.state.proteinPercent, this.state.fatPercent)) {
            return;
        }

        this.setState({ updated: true, carbPercent: parseFloat(event.target.value) });
    }

    setProteinPercent = (event: any) => {
        var val = parseFloat(event.target.value);

        if (val < this.getMinMaxMacroPortions(this.state.macroType)['protein']['min']) {
            this.setState({ updated: true, proteinPercent: this.getMinMaxMacroPortions(this.state.macroType)['protein']['min'] });
            return;
        }

        if (val > this.getMinMaxMacroPortions(this.state.macroType)['protein']['max']) {
            this.setState({ updated: true, proteinPercent: this.getMinMaxMacroPortions(this.state.macroType)['protein']['max'] });
            return;
        }

        if (this.isPortionsExceeded(this.state.carbPercent, val, this.state.fatPercent)) {
            return;
        }

        this.setState({ updated: true, proteinPercent: parseFloat(event.target.value) });
    }

    setFatPercent = (event: any) => {
        var val = parseFloat(event.target.value);

        if (val < this.getMinMaxMacroPortions(this.state.macroType)['fat']['min']) {
            this.setState({ updated: true, fatPercent: this.getMinMaxMacroPortions(this.state.macroType)['fat']['min'] });
            return;
        }

        if (val > this.getMinMaxMacroPortions(this.state.macroType)['fat']['max']) {
            this.setState({ updated: true, fatPercent: this.getMinMaxMacroPortions(this.state.macroType)['fat']['max'] });
            return;
        }

        if (this.isPortionsExceeded(this.state.carbPercent, this.state.proteinPercent, val)) {
            return;
        }

        this.setState({ updated: true, fatPercent: parseFloat(event.target.value) });
    }

    macroPortionsDict = {
        'Lose Weight': { 'carb': { 'min': 25, 'max': 45 }, 'protein': { 'min': 35, 'max': 50 }, 'fat': { 'min': 20, 'max': 35 } },
        'Maintain/Muscle Gain': { 'carb': { 'min': 35, 'max': 55 }, 'protein': { 'min': 25, 'max': 40 }, 'fat': { 'min': 25, 'max': 40 } },
        'Gain Weight': { 'carb': { 'min': 40, 'max': 60 }, 'protein': { 'min': 25, 'max': 35 }, 'fat': { 'min': 15, 'max': 25 } }
    };

    getMinMaxMacroPortions = (macroType: string) => {
        if (macroType === 'Lose Weight') {
            return this.macroPortionsDict['Lose Weight'];
        }

        if (macroType === 'Maintain/Muscle Gain') {
            return this.macroPortionsDict['Maintain/Muscle Gain'];
        }

        if (macroType === 'Gain Weight') {
            return this.macroPortionsDict['Gain Weight'];
        }

        return this.macroPortionsDict['Lose Weight'];
    }

    getActivityLevelFactor = () => {
        if (this.props.personal.activityLevel === 0) {
            return 1.2;
        }

        if (this.props.personal.activityLevel === 1) {
            return 1.375;
        }

        if (this.props.personal.activityLevel === 2) {
            return 1.55;
        }

        if (this.props.personal.activityLevel === 3) {
            return 1.725;
        }

        if (this.props.personal.activityLevel === 4) {
            return 1.9;
        }

        return 0;
    }

    getMacroSetup = () => {
        if (this.state.manualMacro) {
            return (
                <Grid.Row columns={2} stretched>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Macro Settings Mode</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <h4>MANUAL</h4>
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Carb Weight</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.carbWeight} placeholder='Weight' onChange={this.updateCarbWeight} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Protein Weight</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.proteinWeight} placeholder='Weight' onChange={this.updateProteinWeight} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Fat Weight</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.fatWeight} placeholder='Weight' onChange={this.updateFatWeight} />
                    </Grid.Column>
                </Grid.Row>);
        }
        return (<Grid.Row columns={2} stretched>
            <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                <a>Macro Settings Mode</a>
            </Grid.Column>
            <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                <h4>AUTO</h4>
            </Grid.Column>
            <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                <a>Acivity Level</a>
            </Grid.Column>
            <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                <Dropdown id='activities' value={this.state.activityLevel} selection options={activityTypes} onChange={this.setActivityLevel} />
            </Grid.Column>
            <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                <a>Macro Type</a>
            </Grid.Column>
            <Grid.Column width={12} textAlign='left'>
                <Dropdown id='plans' value={this.state.macroType} selection options={mealPlan} onChange={this.setMacroType} />
            </Grid.Column>
            <Grid.Column as='a' width={3} textAlign='left'>
                <a>Carb</a>
            </Grid.Column>
            <Grid.Column width={3} textAlign='left' verticalAlign='middle'>
                <a style={divLabelStyle}>[{this.getMinMaxMacroPortions(this.state.macroType)['carb']['min']}% - {this.getMinMaxMacroPortions(this.state.macroType)['carb']['max']}%]</a>
            </Grid.Column>
            <Grid.Column width={8} textAlign='left' verticalAlign='middle'>
                <RangeSlider
                    variant='success'
                    value={this.state.carbPercent}
                    onChange={this.setCarbPercent}
                    tooltipLabel={currentValue => `${currentValue}%`}
                    tooltip='off'
                    min={this.getMinMaxMacroPortions(this.state.macroType)['carb']['min']}
                    max={this.getMinMaxMacroPortions(this.state.macroType)['carb']['max']}
                />
            </Grid.Column>
            <Grid.Column width={2} textAlign='right' verticalAlign='middle'>
                <a>{this.state.carbPercent}%</a>
            </Grid.Column>
            <Grid.Column as='a' width={3} textAlign='left'>
                <a>Protein</a>
            </Grid.Column>
            <Grid.Column width={3} textAlign='left' verticalAlign='middle'>
                <a style={divLabelStyle}>[{this.getMinMaxMacroPortions(this.state.macroType)['protein']['min']}% - {this.getMinMaxMacroPortions(this.state.macroType)['protein']['max']}%]</a>
            </Grid.Column>
            <Grid.Column width={8} textAlign='left'>
                <RangeSlider
                    variant='warning'
                    value={this.state.proteinPercent}
                    onChange={this.setProteinPercent}
                    tooltipLabel={currentValue => `${currentValue}%`}
                    tooltip='off'
                    min={this.getMinMaxMacroPortions(this.state.macroType)['protein']['min']}
                    max={this.getMinMaxMacroPortions(this.state.macroType)['protein']['max']}
                />
            </Grid.Column>
            <Grid.Column width={2} textAlign='right' verticalAlign='middle'>
                <a>{this.state.proteinPercent}%</a>
            </Grid.Column>
            <Grid.Column as='a' width={3} textAlign='left'>
                <a>Fat</a>
            </Grid.Column>
            <Grid.Column width={3} textAlign='left' verticalAlign='middle'>
                <a style={divLabelStyle}>[{this.getMinMaxMacroPortions(this.state.macroType)['fat']['min']}% - {this.getMinMaxMacroPortions(this.state.macroType)['fat']['max']}%]</a>
            </Grid.Column>
            <Grid.Column width={8} textAlign='left'>
                <RangeSlider
                    variant='danger'
                    value={this.state.fatPercent}
                    onChange={this.setFatPercent}
                    tooltipLabel={currentValue => `${currentValue}%`}
                    tooltip='off'
                    min={this.getMinMaxMacroPortions(this.state.macroType)['fat']['min']}
                    max={this.getMinMaxMacroPortions(this.state.macroType)['fat']['max']}
                />
            </Grid.Column>
            <Grid.Column width={2} textAlign='right' verticalAlign='middle'>
                <a>{this.state.fatPercent}%</a>
            </Grid.Column>
        </Grid.Row>)
    }

    render() {
        if (this.props.update !== this.state.dirty)
        {
            this.setState({
                carbPercent: this.props.personal.carbPercent,
                proteinPercent: this.props.personal.proteinPercent,
                fatPercent: this.props.personal.fatPercent,
                carbWeight: this.props.personal.carbWeight,
                proteinWeight: this.props.personal.proteinWeight,
                fatWeight: this.props.personal.fatWeight,
                manualMacro: this.props.personal.manualMacro,
                activityLevel: this.getActivityLevelText(this.props.personal.activityLevel),
                macroType: this.getMacroTypeText(this.props.personal.macroType),
                dirty: !this.state.dirty
            });
        }

        if (this.state.updated === true) {
            this.props.updatePersonal({
                avatar: this.props.personal.avatar, name: this.props.personal.name, age: this.props.personal.age,
                height: this.props.personal.height, weight: this.props.personal.weight, targetWeight: this.props.personal.targetWeight,
                activityLevel: this.getActivityLevel(this.state.activityLevel),
                macroType: this.getMacroType(this.state.macroType), carbPercent: this.state.carbPercent,
                proteinPercent: this.state.proteinPercent, fatPercent: this.state.fatPercent,
                carbWeight: this.state.carbWeight, proteinWeight: this.state.proteinWeight,
                fatWeight: this.state.fatWeight, manualMacro: this.state.manualMacro
            });
            this.setState({ updated: false });
        }

        return (
            <Grid centered>
                <Grid.Row columns={2} stretched>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Manual Macro</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Radio toggle checked={this.state.manualMacro} onChange={this.toggleManualMacro} />
                    </Grid.Column>
                </Grid.Row>
                {this.getMacroSetup()}
            </Grid>);
    }
}

export default connect()(PersonalMacroTable);