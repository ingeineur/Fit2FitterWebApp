import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Grid, Icon, Menu, Dropdown, Modal, Label, Image, Container, Header, Divider, Segment } from 'semantic-ui-react'
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import './signin.css';
import App from '../App';

interface IProps {
}

interface IState {
    ladies: GalleryImage[];
    apps: GalleryImage[];
}

interface GalleryImage {
    original: string,
    thumbnail: string,
    sizes: string
}

var divFooterStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFFFFF',
    backgroundColor: '#382c2d'
};

var divLabelStyle2 = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

class LandingPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            ladies: [],
            apps: []
        };
    }

    public componentDidMount() {
        let ladies: GalleryImage[] = [];
        let apps: GalleryImage[] = [];
        let i: number = 0;
        for (i = 1; i < 18; i++) {
            var img = 'ladies/img' + i + '.jpg';
            ladies.push({
                original: img,
                thumbnail: img,
                sizes: '(max-width: 200px) 200px, 80vw'
            });
        }

        for (i = 1; i < 9; i++) {
            var img = 'snapshots/img' + i + '.png';
            apps.push({
                original: img,
                thumbnail: img,
                sizes: '(max-width: 200px) 200px, 80vw'
            });
        }
        this.setState({ ladies: ladies, apps: apps });
    }

    render() {
        var divStyle2 = {
            fontFamily: 'Comic Sans MS',
            fontSize: '13px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        return (
            <div>
                <div>
                    <Button circular color='facebook' href='https://www.facebook.com/idafit2fitter' target='_blank' icon='facebook square' />
                    <Button circular color='instagram' href='https://www.instagram.com/idafit2fitter/' target='_blank' icon='instagram' />
                </div>
                <div style={divLabelStyle2}>
                    <Grid>
                        <Grid.Column>
                            <div id='logo'><Image src="fit2fitter_new_big_logo.png" size='big' /></div>
                        </Grid.Column>
                    </Grid>
                </div>
                <Grid centered>
                    <Grid.Row textAlign='center' />
                    <Grid.Row textAlign='center'>
                        <Grid.Column textAlign='center' width={16}>
                            <div>
                                <h3 className="text-ida">IDA SULAIMAN</h3>
                            </div>
                            <div>
                                <div className='text-job'>Nutritionist & Personal Trainer</div>
                            </div>
                            <Divider clearing />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'/>
                    <Grid.Row textAlign='center'>
                        <Grid.Column textAlign='center'>
                            <div>
                                <h3 className="text-ida">SPECIALTIES</h3>
                            </div>
                            <div>
                                <Container fluid>
                                    <p><div className='text-specialist'>Weight Loss Program For Women</div></p>
                                    <p><div className='text-specialist'>Obesity and Weight Management</div></p>
                                    <p><div className='text-specialist'>Sport Dietetics</div></p>
                                    <p><div className='text-specialist'>Mediterranean Diet</div></p>
                                    <p><div className='text-specialist'>Food as Medicine</div></p>
                                    <p><div className='text-specialist'>Pilates & HIIT Workout</div></p>
                                    <p><div className='text-specialist'>Nutrition for Adolescence</div></p>
                                </Container>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        <Grid.Column textAlign='center'>
                            <div>
                                <h3 className="text-ida">SERVICES</h3>
                            </div>
                            <div>
                                <Container fluid>
                                    <p><div className='text-specialist'>Individual Consultation</div></p>
                                    <p><div className='text-specialist'>Group Consultation</div></p>
                                    <p><div className='text-specialist'>Meal Planning</div></p>
                                    <p><div className='text-specialist'>Diet Analysis</div></p>
                                    <p><div className='text-specialist'>Nutrition Education</div></p>
                                    <p><div className='text-specialist'>Menu Analysis</div></p>
                                    <p><div className='text-specialist'>Workshop</div></p>
                                    <p><div className='text-specialist'>Online Workout</div></p>
                                </Container>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        <Grid.Column width={16} textAlign='left'>
                            <div className="text-about">
                                <u>About Ida</u>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='left'>
                            <div>
                                <Image src="profiles/ida_profile_new_3.jpg" size='small' rounded floated='right' />
                                <p>
                                    I'm Ida, a Melbourne-based qualified Australian Traditional Medicine and Counsellor.
                                    I specialise in helping people to take charge of their health and wellness through
                                    the right knowledges, supports, and nutritional advices.
                                </p>
                                <p>
                                    My passion is to educate others about the importance of food nutritions and how they affect our body health and mental well-being. 
                                    My goal is to deliver evidence-based nutritions that will help people reach their optimal 
                                    health in a manageable and sustainable manner.
                                </p>
                                <p>
                                    My philosophy in nutrition is to feed our bodies with wholesome and nutritious foods that will 
                                    help them grow naturally. I teach women how to leverage natural food's power to boost their energy, 
                                    feed their bodies, and supercharge their behaviors so they can feel great inside and out! 
                                </p>
                            </div>
                        </Grid.Column>
                        <Grid.Column textAlign='left' width={16}>
                            <div className="text-about">
                                <u>My Missions</u>
                            </div>
                        </Grid.Column>
                        <Grid.Column textAlign='left' width={16}>
                            <div>
                                <Image src="profiles/ida_profile_new_2.jpg" size='small' floated='left' />
                                <p>
                                    I believe in a holistic approach to health, which considers all aspects of our physical, spiritual, mental, and emotional well-being.
                                </p>
                                <p>
                                    I've started focusing on nutrition and fitness since I had my twin boys:
                                    Muhammad and Muadz (8 years old in 2020).
                                    As a result, I've decided to pursue fitness and nutrition certifications.
                                    In 2018, while completing my fitness study and nutrition research at the same time,
                                    I assembled a group of ladies for my 1st Body Transformation Program and BANG!
                                    Surprisingly, everyone achieved their goals! Alhamdulillah!
                                </p>
                                <p>
                                    Since then, I've made it my MISSION and launched my BTP program online from home in September 2019 just before pandemic!
                                </p>
                            </div>
                        </Grid.Column>
                        <Grid.Column textAlign='center' width={16}>
                            <div>
                                <h3 className="text-ida">HOW DOES IT WORK?</h3>
                                <Divider />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <div className="text-step">Step 1</div>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <div className="text-step-desc">LETS START THE CONVERSATION</div>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <Icon size='big' color='orange' name='phone square' />
                            <Icon size='big' color='blue' name='video camera' />
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='left'>
                            <p>I offer a free 15-30 minute discovery call (zoom meeting) where we discuss your
                            health journey and how your diet, lifestyle and mindset may be contributing to your health.
                            This is a perfect opportunity for you to ask questions and find out if I am the right person to support you through your health journey. I promise to give you the up-to-date evidence-based advice you need and get you started on your journey to feel better within yourself.</p>

                            <p>
                                All my programs are operating online which makes it super convenient for anyone to
                                be able to access my nutrition and fitness services. These consultations are available
                                Australia and Malaysia wide. All you will need to do is download the free app zoom to your
                                computer or phone and have access to internet. Its as easy as that!
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        <Grid.Column width={16} textAlign='center'>
                            <div className="text-step">Step 2</div>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <div className="text-step-desc"> INITIAL 1:1 CONSULTATION</div>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <Icon size='big' color='orange' name='talk' />
                            <Icon size='big' color='blue' name='write' />
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='left'>
                            <p>Change can be challenging, but having the knowledge and understanding can make things easier.
                            Our initial 60 minute consultation includes offering personalised information and
                            counselling and therefore would be look from another person session. During this session,
                            we will:</p>

                            <p>
                                discuss and talk about your current health and medical background
                                unpack your thoughts and beliefs about food and your body
                                discuss current eating patterns and foods you like and dislike
                                discuss the bigger picture of life - where you have been, where you are not,
                                and dig deep to understand the (why) behind your concerns
                                identify any barriers that might stand in the way of achieving your goals
                                identify the areas in life you would like to focus on
                            </p>
                            <p>
                                Together, we will create a plan to help you achieve your goals.
                                I will provide you the tools you need to take the necessary steps to
                                meet your goals and be your one-on-one support every step of the way.
                                Additionally, I will provide you nutritional knowledge and lifestyle
                                advice to help you make sustainable life-long changes for your health and wellbeing.
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        <Grid.Column width={16} textAlign='center'>
                            <div className="text-step">Step 3</div>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <div className="text-step-desc">FOLLOW UP CONSULTATION</div>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <Icon size='big' color='orange' name='mail' />
                            <Icon size='big' color='blue' name='mail forward' />
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='left'>
                            <p>In the follow-up sessions, we will:</p>

                            <ul>
                                <li>talk about how things are going throughout your journey</li>
                                <li>focus on strategies, knowledge and skills to help you move towards your goals</li>
                                <li>discuss any obstacles you may have come across or any revelations you may have discovered about yourself</li>
                            </ul>

                            <p>
                                It is chance to review, reflect and re-evaluate your plan
                                and make any adjustments to priorities, goals and plans to
                                help you move forward in improving your health and wellbeing.
                                Together we will continue to move forward in improving your
                                health and wellbeing to make sure that you are seeing positive results, even after completion.
                            </p>
                            <p>
                                The number of sessions you need will depend on your goals,
                                readiness for change, what supports systems you have in
                                place and where you relationship with food, body and mind stand.
                                It is challenging to predict, but I will be here for you as
                                long as you find value in our sessions and need support.
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <h3 className="text-ida">MY SERVICES</h3>
                            <Divider />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <p>
                                <h3 style={{ 'color': '#D1B000' }}>1. INDIVIDUAL CONSULTATION</h3>
                                <h5>What dietary guidance do you need?</h5>
                            </p>
                            <Image src="consultation_img.png" size='medium' rounded />
                            <p>
                                <h5>Specialised advice</h5>
                                Newly diagnosed with a disorder or chronic
                                disease or managing a special condition?
                                Fit2Fitter are specialists in treating complex,
                                challenging conditions where dietary
                                guidance is required. We understand this
                                can be a time of great upheaval. Our aim is
                                to help you navigate your diet and lifestyle
                                into a new normal as quickly as possible.
                                Having good advice and a dietary plan of
                                action can help. We have a wealth of
                                advice to share and we do that in a
                                realistic and caring way.
                            </p>
                            <p>
                                <h5>General nutrition</h5>
                                Do you need some general guidance
                                towards better nutrition and overall health?
                                We have great evidence-based advice for
                                people of all ages who are looking to
                                achieve a balanced diet and healthy
                                weight in an easy and sustainable way. If
                                you are looking for a great meal plan for
                                yourself or the family, we can also work
                                with you to create healthy and sustainable
                                menus over 7-21 days.
                            </p>
                            <p>
                                <h5>Weight management</h5>
                                Weight Loss/ Weight Gain (adults and children)
                            </p>
                            <p>
                                <h5>Disease and disorder management</h5>
                                <ul>
                                    <li>Diabetes</li>
                                    <li>Impaired Glucose Intolerance</li>
                                    <li>High Cholesterol</li>
                                    <li>Heart Disease</li>
                                    <li>Hypertension</li>
                                    <li>Autoimmune Disorders</li>
                                    <li>Under-Active Thyroid and Hashimotos</li>
                                    <li>Eating Disorders</li>
                                    <li>Anaemia</li>
                                    <li>Nutrient Deficiencies</li>
                                </ul>
                            </p>
                            <p>
                                <h5>Gut health</h5>
                                <ul>
                                    <li>Gut Microbiome health</li>
                                    <li>Gastrointestinal Problems</li>
                                    <li>Irritable Bowel Syndrome</li>
                                    <li>Inflammatory bowel disease</li>
                                    <li>Coeliac Disease</li>
                                    <li>Food Allergies and Intolerances</li>
                                    <li>Fatty Liver and Liver Disease</li>
                                </ul>
                            </p>
                            <p>
                                <h5>Women Health</h5>
                                <ul>
                                    <li>PCOS (Poly-Cystic Ovarian Syndrome)</li>
                                    <li>Endometriosis (pain management)</li>
                                    <li>Pregnancy and Lactation</li>
                                    <li>Gestational Diabetes</li>
                                    <li>Fertility</li>
                                </ul>
                            </p>
                            <p>
                                <h5>Other specialty areas</h5>
                                <ul>
                                    <li>Mediterranean Diet</li>
                                    <li>Childhood Nutrition</li>
                                    <li>Anti-Inflammatory Diet</li>
                                </ul>
                            </p>
                            <div style={{ 'color': '#D1B000' }}>
                                <p>
                                    <h5>Cost:</h5>
                                    <h5>Normal Consultation</h5>
                                    <ul>
                                        <li>Standard Initial $150, 90-120 minutes</li>
                                        <li>Standard Review $100, 60 minutes</li>
                                        <li>Follow Up $70, 15-30 minutes</li>
                                        <li>Pensioners $140, $90, $65</li>
                                    </ul>
                                </p>
                                <p>
                                    <h5>Special need</h5>
                                    <ul>
                                        <li>Extended Initial $200, 45-60
                                        minutes (Eating disorders, newly
                                        diagnosed Coeliacs,
                                        Endometriosis, PCOS,
                                        menopause, fertility and
                                        autoimmune patients or patients
                                        requiring extended time)
                                    </li>
                                        <li>Standard Review $120, 30 minutes</li>
                                        <li>Extended Review $150, 45 minutes</li>
                                        <li>Follow Up $70, 15 minutes</li>
                                        <li>Subsequent Extended $120, 30 minutes</li>
                                        <li>Pensioners $10 off</li>
                                    </ul>
                                </p>
                            </div>
                            <div style={{ 'fontStyle': 'italic', 'fontWeight': 'bold' }}>
                                <p>
                                    *For Malaysia, please contact me
                                    personally for price in RM.
                                </p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider />
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <p>
                                <h3 style={{ 'color': '#D1B000' }}>2. GROUP CONSULTATION: 6 WEEK BODY TRANSFORMATION PROGRAM</h3>
                            </p>
                            <p>
                                This programme is only offered twice a
                                year, in June and December. However, if
                                you have your own group with a minimum
                                of 5 participants, we can still proceed, start
                                anytime and you can contact me for more
                                information.
                            </p>
                            <p>
                                <h5>NUTRITION</h5>
                                Meal plan suited to your body type, goals
                                and dietary requirements. You will never be
                                bored or stuck for ideas with nutrient 
                                dense and delicious recipes accessible at
                                your fingertips.
                            </p>
                            <p>
                                <h5>TRAINING</h5>
                                Customised training program to sculpt and
                                shape your body according to your
                                specific goals and lifestyle. The dynamic
                                workouts can be completed at the gym or
                                in the comfort of your own home.
                            </p>
                            <p><Image src="group_consultation_img.png" size='medium' rounded /></p>
                            <p>
                                <h5>MINDSET</h5>
                                Educational session and discussion to
                                support and motivate you at each step of
                                your transformation journey. In Fit2Fitter
                                believes in not only helping you transform
                                your body, but also your mind.
                            </p>
                            <p>
                                <h5>SUPPORT</h5>
                                In Fit2Fitter you are never alone.
                                You will be supported every step
                                of the way by the Fit2Fitter team,
                                and thousands of Fit2Fitter Transformers just like you.
                                Stay accountable with weekly checkins and online support.
                            </p>
                            <p>
                                <h5>**IF NEEDED</h5>
                                1:1 consultation with extra cost.
                            </p>
                            <div style={{ 'color': '#D1B000' }}>
                                <p>
                                    <h5>Cost:</h5>
                                    $199 for 6 weeks
                                </p>
                            </div>
                            <div style={{ 'fontStyle': 'italic', 'fontWeight': 'bold' }}>
                                <p>
                                    *For Malaysia, please contact me
                                    personally for price in RM.
                                </p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider />
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <p>
                                <h3 style={{ 'color': '#D1B000' }}>3. MEAL PLANNING</h3>
                            </p>
                            <p>
                                <h5>A plan that iss tailored to your health needs</h5>
                                You may be looking for online meal
                                planning to help you lose weight. Or you
                                may be looking to overhaul your diet for
                                health reasons. Whatever your goals, do not
                                leave this important decision to the latest
                                guru. Or, in the hands of a fad diet.
                            </p>
                            <p>
                                Removing or restricting food groups can
                                sometimes lead to unintended
                                consequences, like major nutritional
                                imbalance. Inadequate dietary intake can
                                also upset the delicate gut microbiome,
                                which is so important for immunity, weight
                                management and overall prevention of
                                chronic disease. Let us get you moving
                                towards your health goals safely, easily
                                and enjoyably.
                            </p>
                            <p>
                                <h5>Meal planning by expertise</h5>
                                We have so much experience which we can
                                offer you, devising meal plans for a
                                comprehensive range of health goals.
                            </p>
                            <Image src="meal_planning_img.png" size='medium' rounded />
                            <p>
                                This might include weight management
                                (including bariatric meal plans); meal plans
                                to help manage your chronic disease or condition; 
                                allergies, intolerances,
                                immunity, family nutrition and
                                more.
                            </p>
                            <p>
                                Our online meal planning
                                sessions are a really easy
                                process to help formulate the
                                best menu for your unique needs.
                                All without needing to step into
                                the clinic.
                            </p>
                            <div style={{ 'color': '#D1B000' }}>
                                <p>
                                    <h5>Cost:</h5>
                                    <ul>
                                        <li>Meal plan design for a 7 day plan $150</li>
                                        <li>Meal plan design for 1 day (includes 2-3 options for each meal) $100</li>
                                    </ul>
                                </p>
                            </div>
                            <div style={{ 'fontStyle': 'italic', 'fontWeight': 'bold' }}>
                                <p>
                                    *For Malaysia, please contact me
                                    personally for price in RM.
                                </p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider />
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <p>
                                <h3 style={{ 'color': '#D1B000' }}>4. SCIENTIFIC DIET ANALYSIS REPORT</h3>
                            </p>
                            <p>
                                A Scientific Diet Analysis will give you
                                granular information on how to optimise
                                your diet for great health. Our Scientific
                                Analysis Report combines an examination
                                of your current diet and a review of your
                                health status. Professional analysis of this
                                information can provide you with a good
                                picture of your dietary needs, and how to
                                achieve optimum nutrition. And the beauty
                                of it? We can provide this report from the
                                comfort of your own home!
                            </p>
                            <p>
                                <h5>What does the report include?</h5>
                                <ul>
                                    <li>A full analysis of a 4-day food diary by
                                    an Accredited Practicing Dietitian</li>
                                    <li>An analysis of your macro and
                                    micronutrients, including calories,
                                    carbohydrates, protein, fats, and
                                    vitamins and minerals</li>
                                    <li>Your results are personalised, based on
                                    the information you provide us
                                    regarding your personal details, health
                                    goals and any medical conditions</li>
                                    <li>We can tell you how to adapt your diet
                                    for weight loss, improved support of
                                    your gut, reduced inflammation and
                                    also correct ratios of macronutrients.</li>
                                </ul>
                            </p>
                            <p>
                                <ul>
                                    <li>Once payment for your report
                                    has been received, you will have
                                    instant access to our Health
                                    Analysis Form Booklet. This form
                                    includes information for you to
                                    tell us about your medical
                                    history, any allergies or
                                    intolerances you may have, as
                                    well as questions about your
                                    health goals. Please fill in this
                                    form and email your scanned
                                    copy directly to idafit2fitter@gmail.com.</li>
                                    <li>You also will receive another booklet on how to complete a Four Day Food
                                    Diary. In this step, we ask you to keep track of 5 days worth of meals from
                                    breakfast through to dinner (and anything after!) via a handy app. That
                                    way, we have a sample of your typical diet. Don not worry if you have the
                                    odd day which is not typical, it is the average of those days that counts.</li>
                                    <li>Please provide us with your returned information within 30 days of your
                                    purchase. We recommend you start your diary as soon as you purchase, as it is easy to let it slip by.</li>
                                </ul>
                            </p>
                            <Image src="analysis_img.png" size='medium' rounded />
                            <p><h4>We will perform your Scientific Diet Analysis and provide you with a written
                            report within 7 days of receiving both your completed Health Analysis Form
                                and your Five Day Food Diary (which you can share with us inside of the app).</h4>
                            </p>
                            <div style={{ 'color': '#D1B000' }}>
                                <p style={{ 'fontWeight': 'bold' }}>
                                    <h5>Cost:</h5>
                                    Full diet analysis and report $150
                                </p>
                            </div>
                            <div style={{ 'fontStyle': 'italic', 'fontWeight': 'bold' }}>
                                <p>
                                    *For Malaysia, please contact me
                                    personally for price in RM.
                                </p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider />
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <p>
                                <h3 style={{ 'color': '#D1B000' }}>5. NUTRITION EDUCATION</h3>
                            </p>
                            <p>
                                <h5>Nutrition in School</h5>
                                This programs are focused on inspiring
                                secondary students to make great food
                                and lifestyle choices based on evidence,
                                not hype. We know the best way to help
                                high school students adopt a new
                                perspective is to give them real tools they
                                can use in the real world. Our programs are
                                all about empowering students. We give
                                teenagers the tools for good nutrition and
                                great health, for life. In this way, they are
                                able to challenge unfettered advice and
                                the sometimes dangerous approaches to
                                food and lifestyle available to them.
                            </p>
                            <p><Image src="nutrition_education.png" size='medium' rounded /></p>
                            <p>
                                This programs offers sensible, evidencebased advice about how to eat well,
                                taught by Accredited Practising Dietitians.
                                There is good evidence supporting nutrition
                                education in schools. If your school wishes
                                to provide more well-being education to
                                students, we offer a ready resource.
                            </p>
                            <p>
                                <h5>Nutrition in Corporate/Community</h5>
                                Help your employees enjoy life, both
                                inside and outside the workplace.
                            </p>
                            <p>
                                Our Corporate Nutrition Seminars use
                                evidence-based therapies to help
                                your employees improve their
                                physical, mental and emotional
                                wellbeing. Promoting and supporting
                                corporate nutrition and health in the
                                workplace is not only common sense,
                                but it is essential for your companys
                                success!
                            </p>
                            <p>
                                Our nutritionists can help make
                                businesses more productive and
                                employees more engaged! By helping your company focus on
                                workplace health and nutrition, we can work
                                with you to:
                                <ul>
                                    <li>Improve work performance and
                                    productivity</li>
                                    <li>Reduce absenteeism and sick leave</li>
                                    <li>Improve morale</li>
                                    <li>Improve engagement</li>
                                </ul>
                            </p>
                            <p>
                                <h5>Seminar Topic Options</h5>
                                <ul>
                                    <li>Working it out for the workaholics</li>
                                    <li>Work hard play hard- nutrition for the restless</li>
                                    <li>Sinking stressful habits</li>
                                    <li>Balancing the plate</li>
                                    <li>Eating out, entertaining and travel</li>
                                    <li>The Mediterranean Diet The best diet
                                    for preventing and treating chronic
                                    disease and improving longevity!</li>
                                </ul>
                            </p>
                            <ul>
                                <li>Mood & Food: The Link Explained</li>
                                <li>Eating Well for Busy Corporates</li>
                                <li>Nutrition: Separating Fact from Fad</li>
                                <li>Debunking Diet Myths</li>
                                <li>Nutrition for the Whole Family</li>
                                <li>How to Read Food Labels: A Virtual Supermarket Tour</li>
                                <li>Eating out workshop: How to choose from the menu</li>
                                <li>Health Gut Microbiome (pre and probiotics)</li>
                                <li>Food for Life (Increasing Immunity and Preventing Sickness)</li>
                                <li>Request your own topic!</li>
                            </ul>

                            <p>
                                <h5>Other Services</h5>
                                <ul>
                                    <li>Corporate Cooking demonstrations</li>
                                    <li>Provision of a meal (morning tea or lunch)</li>
                                </ul>
                            </p>
                            <div style={{ 'color': '#D1B000' }}>
                                <p style={{ 'fontWeight': 'bold' }}>
                                    <h5>Cost:</h5>
                                    Prices vary depending on your
                                    package and number of staff. Please
                                    email your interest to
                                    idafit2fitter@gmail.com for additional
                                    information or to request a quote!
                                </p>
                            </div>
                            <div style={{ 'fontStyle': 'italic', 'fontWeight': 'bold' }}>
                                <p>
                                    *For Malaysia, please contact me
                                    personally for price in RM.
                                </p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider />
                    <Grid.Row textAlign='center'>
                        <Grid.Column textAlign='center'>
                            <p>
                                <h3 style={{ 'color': '#D1B000' }}>6. WORKOUT ONLY</h3>
                                Online exercise classes are instructional activities that you can
                                participate in live or watch and follow along with from the comfort of
                                your own home, either via livestream or on-demand. You have unlimited
                                access to all of the sessions and recorded video if the time does not suit
                                you.
                            </p>
                            <div style={{ 'color': '#D1B000' }}>
                                <p style={{ 'fontWeight': 'bold', 'fontSize': '20px' }}>
                                    A$16.25 PER WEEK
                                </p>
                            </div>
                            <div style={{ 'fontStyle': 'italic', 'fontWeight': 'bold' }}>
                                <p>
                                    *For Malaysia, please contact me
                                    personally for price in RM.
                                </p>
                            </div>
                            <p style={{ 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex' }}><Image src="workout_timetable.png" size='massive' rounded /></p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <h3 className="text-ida">LADIES TRANSFORMATIONS</h3>
                            <Divider />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <ImageGallery showFullscreenButton={false} items={this.state.ladies} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <h3 className="text-ida">Fit2Fitter Health & Fitness App</h3>
                            <Divider />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <ImageGallery items={this.state.apps} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={ 16 } textAlign='center'>
                            <h3 className="text-ida">BOOK YOUR APPOINTMENT TODAY</h3>
                            <Divider />
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <a className='text-ida' href='https://meetfox.com/en/e/fit2fitternutritionclinicbyida/1' target='_blank'>CLICK HERE</a>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <Icon name='call'/> +61450686296
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Icon name='mail outline' /> 
                            <a href="mailto:idafit2fitter@gmail.com?subject=appointment">idafit2fitter@gmail.com</a>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row/>
                </Grid>
                <footer style={divFooterStyle}> <small>&copy; Copyright 2021, Fit2Fitter by Ida</small> </footer>
            </div>
            );
    }
}

export default LandingPage;
