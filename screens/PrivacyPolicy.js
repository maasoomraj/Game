import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Dimensions,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default class PrivacyPolicy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("SignUpScreen")
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight,
          backgroundColor: "#130B21",
        }}
      >
        <View
          style={{
            margin: 20,
            justifyContent: "center",
            alignItems: "center",
            height: 140,
            borderBottomWidth: 0.5,
            borderColor: "#EC3D6C",
          }}
        >
          <Text style={{ fontSize: 50, fontWeight: "bold", color: "#EC3D6C" }}>
            Privacy Policy
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.bold}>Privacy Policy</Text>
          <Text style={styles.text}>
            Masoom Raj built the TeleGang app as a Free app. This SERVICE is
            provided by Masoom Raj at no cost and is intended for use as is.
            This page is used to inform visitors regarding my policies with the
            collection, use, and disclosure of Personal Information if anyone
            decided to use my Service. If you choose to use my Service, then you
            agree to the collection and use of information in relation to this
            policy. The Personal Information that I collect is used for
            providing and improving the Service. I will not use or share your
            information with anyone except as described in this Privacy Policy.
            The terms used in this Privacy Policy have the same meanings as in
            our Terms and Conditions, which is accessible at TeleGang unless
            otherwise defined in this Privacy Policy.
          </Text>
          <Text style={styles.bold}>Information Collection and Use</Text>
          <Text style={styles.text}>
            For a better experience, while using our Service, I may require you
            to provide us with certain personally identifiable information,
            including but not limited to name , photo, email, password. The
            information that I request will be retained on your device and is
            not collected by me in any way. The app does use third party
            services that may collect information used to identify you. Link to
            privacy policy of third party service providers used by the app
            {"\n"}
            {"\n"}• Google Play Services{"\n"}• Google Analytics for Firebase
            {"\n"}• Expo
          </Text>
          <Text style={styles.bold}>Log Data</Text>
          <Text style={styles.text}>
            I want to inform you that whenever you use my Service, in a case of
            an error in the app I collect data and information (through third
            party products) on your phone called Log Data. This Log Data may
            include information such as your device Internet Protocol (“IP”)
            address, device name, operating system version, the configuration of
            the app when utilizing my Service, the time and date of your use of
            the Service, and other statistics.
          </Text>
          <Text style={styles.bold}>Cookies</Text>
          <Text style={styles.text}>
            Cookies are files with a small amount of data that are commonly used
            as anonymous unique identifiers. These are sent to your browser from
            the websites that you visit and are stored on your device's internal
            memory. This Service does not use these “cookies” explicitly.
            However, the app may use third party code and libraries that use
            “cookies” to collect information and improve their services. You
            have the option to either accept or refuse these cookies and know
            when a cookie is being sent to your device. If you choose to refuse
            our cookies, you may not be able to use some portions of this
            Service.
          </Text>
          <Text style={styles.bold}>Service Providers</Text>
          <Text style={styles.text}>
            I may employ third-party companies and individuals due to the
            following reasons:
            {"\n"}
            {"\n"}• To facilitate our Service;
            {"\n"}• To provide the Service on our behalf;
            {"\n"}• To perform Service-related services;
            {"\n"}• or To assist us in analyzing how our Service is used.
            {"\n"}
            {"\n"}I want to inform users of this Service that these third
            parties have access to your Personal Information. The reason is to
            perform the tasks assigned to them on our behalf. However, they are
            obligated not to disclose or use the information for any other
            purpose.
          </Text>
          <Text style={styles.bold}>Security</Text>
          <Text style={styles.text}>
            I value your trust in providing us your Personal Information, thus
            we are striving to use commercially acceptable means of protecting
            it. But remember that no method of transmission over the internet,
            or method of electronic storage is 100% secure and reliable, and I
            cannot guarantee its absolute security.
          </Text>
          <Text style={styles.bold}>Links to Other Sites</Text>
          <Text style={styles.text}>
            This Service may contain links to other sites. If you click on a
            third-party link, you will be directed to that site. Note that these
            external sites are not operated by me. Therefore, I strongly advise
            you to review the Privacy Policy of these websites. I have no
            control over and assume no responsibility for the content, privacy
            policies, or practices of any third-party sites or services.
          </Text>
          <Text style={styles.bold}>Changes to This Privacy Policy</Text>
          <Text style={styles.text}>
            I may update our Privacy Policy from time to time. Thus, you are
            advised to review this page periodically for any changes. I will
            notify you of any changes by posting the new Privacy Policy on this
            page. This policy is effective as of 2020-07-12
          </Text>
          <Text style={styles.bold}>Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions or suggestions about my Privacy Policy, do
            not hesitate to contact me at raj.8@iitj.ac.in. This privacy policy
            page was created at privacypolicytemplate.net and modified/generated
            by App Privacy Policy Generator
            {"\n"}
            {"\n"}
            {"\n"}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: "#eee",
    paddingHorizontal: 15,
    textAlign: "left",
    fontWeight: "400",
    fontSize: 14,
  },
  bold: {
    color: "#eee",
    paddingHorizontal: 15,
    textAlign: "left",
    paddingBottom: 10,
    paddingTop: 20,
    fontWeight: "bold",
    fontSize: 20,
  },
});
