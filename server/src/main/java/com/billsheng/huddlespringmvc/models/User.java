package com.billsheng.huddlespringmvc.models;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

//User Entity/Model
@Data
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private String chosenTeam;
    private int gamesPlayed;
    private int gamesWon;

    @OneToMany(cascade = CascadeType.ALL)
    @ElementCollection
    private List<Game> games = new ArrayList<>();

    public User(String firstName, String lastName, String email, String password, String chosenTeam, int gamesPlayed, int gamesWon, ArrayList<Game> games) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.chosenTeam = chosenTeam;
        this.gamesPlayed = gamesPlayed;
        this.gamesWon = gamesWon;
        this.games = games;
    }

    public User(String firstName, String lastName, String email, String password, String chosenTeam) {
        this(firstName, lastName, email, password, chosenTeam, 0, 0, null);
    }

    public User(int gamesPlayed, int gamesWon, ArrayList<Game> games) {
        this.gamesPlayed = gamesPlayed;
        this.gamesWon = gamesWon;
        this.games = games;
    }

    public User() {
    }

    public double winPercentage() {
        return (this.gamesWon / this.getGamesPlayed());
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getChosenTeam() {
        return chosenTeam;
    }

    public void setChosenTeam(String chosenTeam) {
        this.chosenTeam = chosenTeam;
    }

    public int getGamesPlayed() {
        return gamesPlayed;
    }

    public void setGamesPlayed(int gamesPlayed) {
        this.gamesPlayed = gamesPlayed;
    }

    public void incrementGamesPlayed() {this.gamesPlayed++;}

    public int getGamesWon() {
        return gamesWon;
    }

    public void setGamesWon(int gamesWon) {
        this.gamesWon = gamesWon;
    }

    public void incrementGamesWon() {this.gamesWon++;}

    public void addGame(Game game) {this.games.add(game); }
}
