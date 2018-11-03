package ru.projects.prog_ja.dto.smalls;

import ru.projects.prog_ja.dto.TagsContainer;

import java.util.Date;

public class SmallQuestionTransfer  extends TagsContainer {

    protected Date createDate;
    protected String title;
    protected long rating;
    protected SmallUserTransfer user;
    protected long views;

    public SmallQuestionTransfer(long id, String title, Date createDate,  long rating, long views, long userId, String smallImagePath, String login, long userRating) {
        super(id);
        this.createDate = createDate;
        this.title = title;
        this.user = new SmallUserTransfer(userId, login, smallImagePath, userRating);
        this.rating = rating;
        this.views = views;
    }

    public SmallQuestionTransfer(long id, String title, Date createDate,  long rating, long views, SmallUserTransfer user) {
        super(id);
        this.createDate = createDate;
        this.title = title;
        this.rating = rating;
        this.user = user;
        this.views = views;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public SmallUserTransfer getUser() {
        return user;
    }

    public void setUser(SmallUserTransfer user) {
        this.user = user;
    }

    public long getRating() {
        return rating;
    }

    public void setRating(long rating) {
        this.rating = rating;
    }

    public long getViews() {
        return views;
    }

    public void setViews(long views) {
        this.views = views;
    }
}
