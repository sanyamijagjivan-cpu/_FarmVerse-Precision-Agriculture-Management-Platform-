package com.farmverse.exception;

public class EmailAlreadyExistsException extends RuntimeException{
  public EmailAlreadyExistsException(String message){
    super(message);
 }
}
