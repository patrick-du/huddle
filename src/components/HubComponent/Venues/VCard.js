import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';

import { Rating } from 'react-native-elements';
import { MapView } from 'expo';
import { Marker, Polyline } from 'react-native-maps'
import polyline from '@mapbox/polyline';


export default class VCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            summary: '',
            duration: '',
            distance: '',
            startAddress: '',
            endAddress: '',
            coords: [],
            steps: [],

        }
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    componentDidMount() {
        this.directionAPI(this.props.origin, this.props.destination)
    }

    async directionAPI(origin, destination) {
        try {
            const direction_API_key = "NOHACKERHAHA";
            let response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${direction_API_key}`)
            let responseJSON = await response.json();

            //Sets state for summary, duration, distance, start address, and end address
            this.setState({
                summary: responseJSON.routes[0].summary,
                duration: responseJSON.routes[0].legs[0].duration.text,
                distance: responseJSON.routes[0].legs[0].distance.text,
                startAddress: responseJSON.routes[0].legs[0].start_address,
                endAddress: responseJSON.routes[0].legs[0].end_address
            })

            //Decodes polyline points and stores each points latitude and longitude in an object in the new array
            //Set state of coords to the new array
            let points = polyline.decode(responseJSON.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            this.setState({ coords: coords })

            //Stores each steps instructions, duration, and distance in thew new array
            //Set state of steps to the new array
            let steps = responseJSON.routes[0].legs[0].steps;
            let stepsArr = steps.map((steps, index) => {
                return {
                    instructions: steps.html_instructions,
                    duration: steps.duration.text,
                    distance: steps.distance.text
                }
            })
            this.setState({
                steps: stepsArr
            })
            return coords

        } catch (error) {
            alert(error)
            return error
        }
    }
    // testFcn(steps) {
    //     for (let i = 0; i <= steps.length; i++) {
    //         console.log(steps[i].duration)
    //         console.log(steps[i].distance)
    //         console.log(steps[i].instructions)

    //     }
    // }
    renderSteps() {
        return this.state.steps.map((steps, index) =>
            <React.Fragment>
                <Text key={index}>{steps.distance} {steps.duration} {steps.instructions}</Text>
                {/* <Text key={index}>{steps.instructions}</Text> */}
            </React.Fragment>

        );
    }

    render(props) {
        const styles = StyleSheet.create({
            card: {
                width: 340,
                marginVertical: 20,
                height: 150
            },
            title: {
                fontSize: 16,
                fontFamily: 'OpenSans-Regular',
                color: 'black',
                paddingTop: 3,

            },
            info: {
                fontFamily: 'OpenSans-Light',
                color: '#adadad',
                fontSize: 12,
                paddingTop: 3,

            },
            vImage: {
                width: 335,
                height: 95,
                borderRadius: 10,
                marginBottom: 5,
            },
            ratingNumber: {
                color: '#adadad',
                marginLeft: 2,
                fontSize: 14,
                fontFamily: 'OpenSans-Light'
            },
            distance: {
                marginLeft: 135,
                fontFamily: 'OpenSans-Regular',
                fontSize: 14,
                color: 'black',
                marginTop: 3,
            },
            modal: {
                height: '100%',
                width: '100%'
            },
            modalMap: {
                height: '40%',
                width: '100%'
            },
            modalCard: {
                width: '100%',
                marginVertical: 20,
                justifyContent: "center",
                alignItems: "center",
                borderColor: '#000',
                borderWidth: 1,
            },
            modalTitle: {
                fontFamily: 'OpenSans-Bold',
                fontSize: 30,
                textAlign: 'center',
            },
            closeButton: {
                width: 100,
                height: 35,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#e74c3c"
            },
            closeText: {
                fontFamily: "OpenSans-Light",
                fontSize: 12,
                color: "white"
            }

        })

        return (

            <TouchableOpacity style={styles.card} onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
            }}>

                <Modal animationType="slide" transparent={false} visible={this.state.modalVisible} onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                    <View style={styles.modal}>
                        <MapView style={styles.modalMap} region={this.props.region}>
                            <Marker coordinate={{
                                latitude: 43.8590,
                                longitude: -79.3152,
                            }} />
                            <Marker coordinate={{
                                latitude: 43.877682,
                                longitude: -79.289383,
                            }} />
                            <Polyline
                                coordinates={this.state.coords}
                                strokeWidth={2}
                                strokeColor="red" />
                        </MapView>

                        <View style={styles.modalCard}>
                            <Text style={styles.modalTitle}>{this.props.place}</Text>
                            <Text>Start Address: {this.state.startAddress}</Text>
                            <Text>End Address: {this.state.endAddress}</Text>
                            <Text>Summary: {this.state.summary}</Text>
                            <Text>Duration: {this.state.duration}</Text>
                            <Text>Distance: {this.state.distance}</Text>
                            <Text>Steps: {this.state.test}</Text>

                            <ScrollView>
                                {this.renderSteps()}
                                {this.renderSteps()}
                                {this.renderSteps()}
                            </ScrollView>

                            {/* <TouchableOpacity style={styles.closeButton} onPress={() => this.testFcn(this.state.steps)}>
                                <Text style={styles.closeText}>Test</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.closeButton} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                                <Text style={styles.closeText}>Go Back</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

                <Image style={styles.vImage} source={this.props.vImage}></Image>
                <View style={{ flexDirection: 'row' }}><Text style={styles.title}>{this.props.place}</Text>
                    <Text style={styles.distance}>{this.props.distance}km</Text>


                </View>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.info}>{this.props.info}</Text>
                    <Rating imageSize={14} fractions={1} readonly startingValue={this.props.stars} style={{ paddingTop: 3, marginLeft: 65 }}></Rating>
                    <Text style={styles.ratingNumber}>{this.props.rating}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}