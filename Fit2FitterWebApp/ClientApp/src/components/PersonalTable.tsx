import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Grid, Dropdown } from 'semantic-ui-react';
import Meals from './Meals';
import RangeSlider from 'react-bootstrap-range-slider';

interface IProps {
    personal: IPersonal;
    update: boolean;
    type: string;
    updatePersonal: Function
}

interface IPersonal {
    name: string;
    age: number;
    height: number;
    weight: number;
    targetWeight: number;
    activityLevel: number;
    macroType: number;
    carbPercent: number;
    proteinPercent: number;
    fatPercent: number;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
    dirty: boolean;
    name: string;
    age: number;
    height: number;
    weight: number;
    targetWeight: number;
    activityLevel: string;
    macroType: string;
    carbPercent: number;
    proteinPercent: number;
    fatPercent: number;
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

class PersonalTable extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false, name: '', age: 0,
            height: 0.0, weight: 0.0, targetWeight: 0.0, activityLevel: 'Sedentary', macroType: 'Lose Weight',
            carbPercent: 10.0, proteinPercent: 40.0, fatPercent: 30.0, dirty: false
        };
    }

    public componentDidMount() {
        this.setState({
            name: this.props.personal.name,
            age: this.props.personal.age,
            height: this.props.personal.height,
            activityLevel: this.getActivityLevelText(this.props.personal.activityLevel),
            macroType: this.getMacroTypeText(this.props.personal.macroType)
        });
    }

    updateName = (event: any) => {
        this.setState({ name: event.target.value, updated: true });
    }

    updateAge = (event: any) => {
        if (isNaN(parseInt(event.target.value))) {
            this.setState({ age: 0, updated: true });
            return;
        }

        this.setState({ age: parseInt(event.target.value), updated: true });
    }

    updateHeight = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ height: event.target.value, updated: true });
        }
    }

    updateWeight = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ weight: event.target.value, updated: true });
        }
    }

    updateTargetWeight = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ targetWeight: event.target.value, updated: true });
        }
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

    render() {
        if (this.props.update !== this.state.dirty)
        {
            console.log('updating total values');
            this.setState({
                name: this.props.personal.name,
                age: this.props.personal.age,
                height: this.props.personal.height,
                weight: this.props.personal.weight,
                targetWeight: this.props.personal.targetWeight,
                carbPercent: this.props.personal.carbPercent,
                proteinPercent: this.props.personal.proteinPercent,
                fatPercent: this.props.personal.fatPercent,
                activityLevel: this.getActivityLevelText(this.props.personal.activityLevel),
                macroType: this.getMacroTypeText(this.props.personal.macroType),
                dirty: !this.state.dirty
            });
        }

        if (this.state.updated === true) {
            this.setState({ updated: false });
            this.props.updatePersonal({
                name: this.state.name, age: this.state.age,
                height: this.state.height, weight: this.state.weight, targetWeight: this.state.targetWeight,
                activityLevel: this.getActivityLevel(this.state.activityLevel),
                macroType: this.getMacroType(this.state.macroType), carbPercent: this.state.carbPercent,
                proteinPercent: this.state.proteinPercent, fatPercent: this.state.fatPercent,
            });
        }

        var divLabelStyle = {
            color:'blue',
            fontSize: '10px',
            verticalAlign: 'middle'
        };

        return (
            <Grid centered>
                <Grid.Row columns={2} stretched>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Name:</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.name} placeholder='Name' onChange={this.updateName} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Age</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.age} placeholder='Age' onChange={this.updateAge} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Height</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.height} placeholder='Height' onChange={this.updateHeight} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Weight</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.weight} placeholder='Weight' onChange={this.updateWeight} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Target Weight</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.targetWeight} placeholder='Weight' onChange={this.updateTargetWeight} />
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
                        <a>Carb:</a>
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
                        <a>Protein:</a>
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
                        <a>Fat:</a>
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
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(PersonalTable);