package com.caltech.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.caltech.pojo.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact,UUID>  {

}
