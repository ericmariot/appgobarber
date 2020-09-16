import React, { useRef, useCallback } from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import api from '../../services/api';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}


const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const  handleSignUp = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('A valid e-mail is required ').email('Type a valid e-mail'),
        password: Yup.string().min(6, 'Mininum of 6 digits'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      Alert.alert('Register completed!', 'You can already log in!');

      navigation.goBack();
    } catch (err) {
      if (err instanceof Yup.ValidationError){
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert('Register Error', 'An error has occured while making your register, check your credentials and try again.');

    }
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        enabled
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1 }}>
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Create your account</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input 
                
                autoCapitalize="words" 
                name="name" 
                icon="user" 
                placeholder="Name" 
                returnKeyType="next" 
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />

              <Input 
                ref={emailInputRef}
                keyboardType="email-address" 
                autoCorrect={false} 
                autoCapitalize="none" 
                name="email" 
                icon="mail" 
                placeholder="E-mail" 
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input 
                ref={passwordInputRef}
                secureTextEntry 
                name="password" 
                icon="lock" 
                placeholder="Password" 
                textContentType="newPassword" 
                returnKeyType="send" 
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
            </Form>

            <Button onPress={() => formRef.current?.submitForm()}>Register</Button>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.navigate('SignIn')} >
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Back to login</BackToSignInText>
      </BackToSignIn>
    </>
  );
  
}

export default SignUp;

