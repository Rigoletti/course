import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[a-zA-Zа-яА-Я]+$/, 'Имя должно содержать только буквы')
    .required('Имя обязательно для заполнения'),
  lastName: yup
    .string()
    .matches(/^[a-zA-Zа-яА-Я]+$/, 'Фамилия должна содержать только буквы')
    .required('Фамилия обязательна для заполнения'),
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9]+$/, 'Логин должен содержать только латинские буквы и цифры')
    .required('Логин обязателен для заполнения'),
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Email обязателен для заполнения'),
  password: yup
    .string()
    .min(8, 'Пароль должен быть не менее 8 символов')
    .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/\d/, 'Пароль должен содержать хотя бы одну цифру')
    .required('Пароль обязателен для заполнения'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Подтверждение пароля обязательно'),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Email обязателен для заполнения'),
  password: yup
    .string()
    .required('Пароль обязателен для заполнения'),
});

export const profileSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[a-zA-Zа-яА-Я]+$/, 'Имя должно содержать только буквы')
    .required('Имя обязательно для заполнения'),
  lastName: yup
    .string()
    .matches(/^[a-zA-Zа-яА-Я]+$/, 'Фамилия должна содержать только буквы')
    .required('Фамилия обязательна для заполнения'),
  bio: yup
    .string()
    .max(500, 'Описание не должно превышать 500 символов'),
});