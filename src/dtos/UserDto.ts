class UserDto {
  id;

  nickname;

  email;

  isActivated;

  constructor(model: any) {
    this.id = model.id;
    this.nickname = model.nickname;
    this.email = model.email;
    this.isActivated = model.isActivated;
  }
}

export default UserDto;
